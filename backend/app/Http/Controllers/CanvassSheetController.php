<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\CanvassSheet;
use App\Models\Item;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class CanvassSheetController extends Controller
{
    public function index()
    {
        $canvasses = CanvassSheet::with('status:id,name')
            ->select('id', 'created_by', 'status_id', 'created_at')
            ->latest()
            ->get()
            ->map(function ($canvass) {
                return [
                    'id' => $canvass->id,
                    'created_by' => $canvass->created_by,
                    'date_created' => $canvass->created_at->toDateString(),
                    'status' => $canvass->status->name ?? null,
                ];
            });

        return response()->json(['data' => $canvasses]);

    }
 
    public function store(Request $request)
    {
        $username = $request->user()->username;
        $validated = $this->canvassValidation($request);

        try {
            $resolvedItems = [];

            foreach ($validated['items'] as $item) {
                $itemModel = Item::where('description', $item['description'])->first();
                $resolvedVendors = [];

                foreach ($item['vendors'] ?? [] as $vendorData) {
                    $vendor = Vendor::where('name', $vendorData['vendor_name'])->first();
                    $resolvedVendors[] = [
                        'model' => $vendor,
                        'data' => $vendorData,
                    ];
                }


                $resolvedItems[] = [
                    'model' => $itemModel,
                    'qty_needed' => $item['qty_needed'],
                    'vendors' => $resolvedVendors,
                ];
            }

            DB::beginTransaction();

            $canvass = CanvassSheet::create([
                'created_by' => $username,
                'status_id' => 1,
                'remarks' => null,
            ]);

            foreach ($resolvedItems as $resolvedItem) {
                $canvassItem = $canvass->items()->create([
                    'item_id' => $resolvedItem['model']->id,
                    'qty_needed' => $resolvedItem['qty_needed'],
                ]);

                foreach ($resolvedItem['vendors'] as $vendorInfo) {
                    $vendorData = $vendorInfo['data'];
                    $vendorModel = $vendorInfo['model'];

                    $canvassItem->vendors()->create([
                        'vendor_id' => $vendorModel->id,
                        'quote' => $vendorData['price'],
                        'stock' => $vendorData['stock'],
                        'qty_order' => $vendorData['amount'] ?? 0,
                        'remarks' => $vendorData['remarks'] ?? null,
                    ]);
                }
            }
            DB::commit();
            return response()->json(['message' => 'Canvass sheet created successfully']);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Item or vendor has not yet been added to the database',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the full error with stack trace to Laravel logs
            Log::error('Canvass store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Something went wrong while saving the canvass sheet.',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function getLastQuote(Request $request)
    {
        $vendorName = $request->query('vendor');
        $itemDescription = $request->query('item');

        $vendor = Vendor::where('name', $vendorName)->first();
        $item = Item::where('description', $itemDescription)->first();

        if (!$vendor || !$item) {
            return response()->json(['price' => null]);
        }

        $quote = DB::table('canvass_item_vendor as civ')
            ->join('canvass_items as ci', 'ci.id', '=', 'civ.canvass_item_id')
            ->where('ci.item_id', $item->id)
            ->where('civ.vendor_id', $vendor->id)
            ->orderByDesc('civ.created_at')
            ->value('civ.quote');

        return response()->json(['price' => $quote]);
    }

    public function getCanvass($id)
    {
        $canvass = CanvassSheet::with([
            'items.item.uom', // Load item and its unit of measure
            'items.vendors.vendor' // Load vendor details for each item
        ])->findOrFail($id);
    
        $formatted = [
            'id' => $canvass->id,
            'created_at' => $canvass->created_at,
            'updated_at' => $canvass->updated_at,
            'created_by' => $canvass->created_by,
            'remarks' => $canvass->remarks,
            'status' => $canvass->status->name,
            'items' => $canvass->items->map(function ($ci) {
                return [
                    'description' => $ci->item->description,
                    'uom' => $ci->item->uom->abbreviation ?? 'N/A',
                    'qty_needed' => $ci->qty_needed,
                    'vendors' => $ci->vendors->map(function ($civ) {
                        return [
                            'vendor_name' => $civ->vendor->name,
                            'price' => $civ->quote,
                            'stock' => $civ->stock,
                            'amount' => $civ->qty_order,
                            'remarks' => $civ->remarks,
                        ];
                    }),
                ];
            }),
        ];

        return response()->json($formatted);
    }
    public function update(Request $request, $id)
    {
        $username = $request->user()->username;

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|exists:items,description',
            'items.*.qty_needed' => 'required|integer|min:1',
            'items.*.vendors' => 'required|array|min:1',
            'items.*.vendors.*.stock' => 'required|integer|min:0',
            'items.*.vendors.*.price' => 'required|numeric|min:0',
            'items.*.vendors.*.vendor_name' => 'required|string|exists:vendors,name',
            'items.*.vendors.*.amount' => 'required|integer|min:0',
            'items.*.vendors.*.remarks' => 'nullable|string',
        ]);
        
        // check inactive vendor
        $validator->after(function ($validator) use ($request) {
            foreach ($request->items as $i => $item) {
                foreach ($item['vendors'] as $j => $vendor) {
                    $vendorRecord = Vendor::where('name', $vendor['vendor_name'])->first();
                    if ($vendorRecord && !$vendorRecord->active) {
                        $validator->errors()->add("items.$i.vendors.$j.vendor_name", "Vendor '{$vendor['vendor_name']}' is inactive.");
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $canvass = CanvassSheet::findOrFail($id);
            $canvass->update(['remarks' => null]); // or keep unchanged

            // Delete old entries
            foreach ($canvass->items as $item) {
                $item->vendors()->delete();
            }
            $canvass->items()->delete();

            foreach ($request->items as $itemData) {
                $item = Item::where('description', $itemData['description'])->first();
                $canvassItem = $canvass->items()->create([
                    'item_id' => $item->id,
                    'qty_needed' => $itemData['qty_needed'],
                ]);

                foreach ($itemData['vendors'] as $vendorData) {
                    $vendor = Vendor::where('name', $vendorData['vendor_name'])->first();

                    $canvassItem->vendors()->create([
                        'vendor_id' => $vendor->id,
                        'quote' => $vendorData['price'],
                        'stock' => $vendorData['stock'],
                        'qty_order' => $vendorData['amount'],
                        'remarks' => $vendorData['remarks'],
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Canvass sheet updated successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Canvass update failed", ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Something went wrong during update.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function canvassValidation(Request $request)
    {
        $rules = [
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|exists:items,description',
            'items.*.qty_needed' => 'required|integer|min:1',
            'items.*.vendors' => 'required|array|min:1',
            'items.*.vendors.*.stock' => 'required|integer|min:0',
            'items.*.vendors.*.price' => 'required|numeric|min:0',
            'items.*.vendors.*.vendor_name' => 'required|string|exists:vendors,name',
            'items.*.vendors.*.amount' => 'required|integer|min:0',
            'items.*.vendors.*.remarks' => 'nullable|string',
        ];

        $messages = [
            'items.required' => 'You must add at least one item.',
            'items.*.description.required' => 'Each item must have a description.',
            'items.*.description.exists' => 'The item does not exist.',
            'items.*.qty_needed.required' => 'Quantity needed is required for each item.',
            'items.*.vendors.required' => 'Each item must have at least one vendor.',
            'items.*.vendors.*.stock.required' => 'Stock is required for each vendor.',
            'items.*.vendors.*.price.required' => 'Price is required for each vendor.',
            'items.*.vendors.*.vendor_name.required' => 'Vendor name is required.',
            'items.*.vendors.*.vendor_name.exists' => 'The vendor does not exist.',
            'items.*.vendors.*.amount.required' => 'Quantity to order is required.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        $validator->after(function ($validator) use ($request) {
            foreach ($request->items as $i => $item) {
                foreach ($item['vendors'] as $j => $vendor) {
                    $vendorRecord = Vendor::where('name', $vendor['vendor_name'])->first();
                    if ($vendorRecord && !$vendorRecord->active) {
                        $validator->errors()->add("items.$i.vendors.$j.vendor_name", "Vendor '{$vendor['vendor_name']}' is inactive.");
                        return;
                    }
                }
            }
        });


        $validator->validate();

        return $validator->validated();
    }

}