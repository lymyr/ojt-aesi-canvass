<?php

namespace App\Http\Controllers;

use App\Models\CanvassItem;
use App\Models\CanvassItemVendor;
use Illuminate\Support\Facades\DB;
use App\Models\CanvassSheet;
use App\Models\Item;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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
 
    // public function store(Request $request)
    // {
    //     $username = $request->user()->username;
    //     $validated = $this->canvassValidation($request);

    //     try {
    //         $resolvedItems = [];

    //         foreach ($validated['items'] as $item) {
    //             $itemModel = Item::where('description', $item['description'])->first();
    //             $resolvedVendors = [];

    //             foreach ($item['vendors'] ?? [] as $vendorData) {
    //                 $vendor = Vendor::where('name', $vendorData['vendor_name'])->first();
    //                 $resolvedVendors[] = [
    //                     'model' => $vendor,
    //                     'data' => $vendorData,
    //                 ];
    //             }


    //             $resolvedItems[] = [
    //                 'model' => $itemModel,
    //                 'qty_needed' => $item['qty_needed'],
    //                 'vendors' => $resolvedVendors,
    //             ];
    //         }

    //         DB::beginTransaction();

    //         $canvass = CanvassSheet::create([
    //             'created_by' => $username,
    //             'status_id' => 1,
    //             'remarks' => null,
    //         ]);

    //         foreach ($resolvedItems as $resolvedItem) {
    //             $canvassItem = $canvass->items()->create([
    //                 'item_id' => $resolvedItem['model']->id,
    //                 'qty_needed' => $resolvedItem['qty_needed'],
    //             ]);

    //             foreach ($resolvedItem['vendors'] as $vendorInfo) {
    //                 $vendorData = $vendorInfo['data'];
    //                 $vendorModel = $vendorInfo['model'];

    //                 $canvassItem->vendors()->create([
    //                     'vendor_id' => $vendorModel->id,
    //                     'quote' => $vendorData['price'],
    //                     'stock' => $vendorData['stock'],
    //                     'qty_order' => $vendorData['amount'] ?? 0,
    //                     'remarks' => $vendorData['remarks'] ?? null,
    //                 ]);
    //             }
    //         }
    //         DB::commit();
    //         return response()->json(['message' => 'Canvass sheet created successfully']);
    //     } catch (ModelNotFoundException $e) {
    //         return response()->json([
    //             'message' => 'Item or vendor has not yet been added to the database',
    //         ], 404);
    //     } catch (\Exception $e) {
    //         DB::rollBack();

    //         // Log the full error with stack trace to Laravel logs
    //         Log::error('Canvass store failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString(),
    //         ]);

    //         return response()->json([
    //             'message' => 'Something went wrong while saving the canvass sheet.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }

    // }

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
            'items.item.uom', 
            'items.vendors.vendor'
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
                    'item_id' => $ci->item->id,
                    'description' => $ci->item->description,
                    'uom' => $ci->item->uom->abbreviation ?? 'N/A',
                    'qty_needed' => $ci->qty_needed,
                    'vendors' => $ci->vendors->map(function ($civ) {
                        return [
                            'vendor_id' => $civ->vendor->id,
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

    public function save(Request $request, $id = null)
    {
        $user = $request->user();
        $validated = $this->canvassValidation($request);

        try {
            DB::beginTransaction();

            $canvass = $id ? CanvassSheet::findOrFail($id) : CanvassSheet::create([
                    'created_by' => $user->username,
                    'remarks' => $validated['remarks'] ?? null,
                    'status_id' => 1,
                ]);

            if ($user->role == "maker") {
                if ($id && $canvass->status_id == 3) {
                    $canvass->status_id = 1; // Reset to pending
                    $canvass->remarks = null; // Clear previous remarks if needed
                    $canvass->save();
                }
                if ($id) {
                    $incomingItemIds = collect($validated['items'])->pluck('item_id')->unique();
                    $canvass->items()->whereNotIn('item_id', $incomingItemIds)->each(function ($item) {
                        $item->vendors()->delete();
                        $item->delete();
                    });
                }
                foreach ($validated['items'] as $itemData) {
                    $item = Item::findOrFail($itemData['item_id']);

                    // updateOrCreate canvass item
                    $canvassItem = CanvassItem::updateOrCreate(
                        [
                            'canvass_id' => $canvass->id,
                            'item_id' => $itemData['item_id'],
                        ],
                        [
                            'qty_needed' => $itemData['qty_needed'],
                        ]
                    );

                    if ($id) {
                        $incomingVendorIds = collect($itemData['vendors'])->pluck('vendor_id')->unique();
                        $canvassItem->vendors()->whereNotIn('vendor_id', $incomingVendorIds)->delete();
                    }

                    foreach ($itemData['vendors'] ?? [] as $vendorData) {
                        $vendor = Vendor::findOrFail($vendorData['vendor_id']);
                        CanvassItemVendor::updateOrCreate(
                            [
                                'canvass_item_id' => $canvassItem->id,
                                'vendor_id' => $vendorData['vendor_id'],
                            ],
                            [
                                'quote' => $vendorData['price'],
                                'stock' => $vendorData['stock'],
                                'qty_order' => $vendorData['amount'],
                                'remarks' => $vendorData['remarks'] ?? null,
                            ]
                        );
                    }
                }
            }
            else if ($user->role == "approver") {
                $canvass->remarks = $validated['remarks'];
                $canvass->status_id = $validated['status_id'];
                $canvass->save();
            }

            DB::commit();

            return response()->json([
                'message' => $id ? 'Canvass sheet updated successfully' : 'Canvass sheet created successfully',
                'canvass_id' => $canvass->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Canvass save failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Something went wrong while saving the canvass sheet.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    private function canvassValidation(Request $request)
    {
        $user = $request->user();
        
        // maker validations
        if ($user->role === "maker") {
            $rules = [
                'items' => 'required|array|min:1',
                'items.*.item_id' => 'required|integer|exists:items,id',
                'items.*.qty_needed' => 'required|integer|min:1',
                'items.*.vendors' => 'required|array|min:1',
                'items.*.vendors.*.vendor_id' => 'required|integer|exists:vendors,id',
                'items.*.vendors.*.stock' => 'required|integer|min:0',
                'items.*.vendors.*.price' => 'required|numeric|min:0',
                'items.*.vendors.*.amount' => 'required|integer|min:0',
                'items.*.vendors.*.remarks' => 'nullable|string',
            ];

            $messages = [
                'items.required' => 'You must add at least one item.',
                'items.*.item_id.required' => 'Missing item: make sure all item fields are filled in.',
                'items.*.item_id.exists' => 'Each item must have a valid item ID.',
                'items.*.qty_needed.required' => 'Quantity needed is required for each item.',
                'items.*.vendors.required' => 'Each item must have at least one valid vendor.',
                'items.*.vendors.*.vendor_id.required' => 'Missing vendor: make sure all vendor fields are filled in.',
                'items.*.vendors.*.vendor_id.exists' => 'Each vendor must have a valid vendor ID.',
                'items.*.vendors.*.stock.required' => 'Stock is required for each vendor.',
                'items.*.vendors.*.price.required' => 'Price is required for each vendor.',
                'items.*.vendors.*.amount.required' => 'Quantity to order is required.',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);

            $validator->after(function ($validator) use ($request) {
                $itemIds = [];
                foreach ($request->items as $i => $item) {
                    $itemId = $item['item_id'];
                    $qtyNeeded = (int) $item['qty_needed'];
                    $totalQtyOrdered = 0;

                    // Check for duplicate items
                    if (in_array($itemId, $itemIds)) {
                        $validator->errors()->add("items.$i.item_id", "Duplicate item detected.");
                    } else {
                        $itemIds[] = $itemId;
                    }

                    $vendorIds = [];
                    foreach ($item['vendors'] as $j => $vendor) {
                        $vendorId = $vendor['vendor_id'] ?? null;

                        // Check for duplicate vendors within this item
                        if (in_array($vendorId, $vendorIds)) {
                            $validator->errors()->add("items.$i.vendors.$j.vendor_id", "Duplicate vendor for the same item.");
                        } else {
                            $vendorIds[] = $vendorId;
                        }

                        if ($vendorId) {
                            $vendorRecord = Vendor::find($vendorId);
                            if ($vendorRecord && !$vendorRecord->active) {
                                $validator->errors()->add(
                                    "items.$i.vendors.$j.vendor_id",
                                    "Vendor '{$vendorRecord->name}' is inactive."
                                );
                            }
                        }

                        $qtyOrder = (int) ($vendor['amount'] ?? 0);
                        $totalQtyOrdered += $qtyOrder;
                        $itemDescription = Item::find($item['item_id'])?->description ?? 'Unknown Item';
                        if ($vendor['amount'] > $vendor['stock']) {
                            $name = $vendorRecord ? $vendorRecord->name : 'Unknown Vendor';
                            $validator->errors()->add(
                                "items.$i.vendors.$j.amount",
                                "{$itemDescription}'s vendor ({$name}) order amount ({$vendor['amount']}) cannot exceed stock ({$vendor['stock']})."
                            );
                        }

                        if ($totalQtyOrdered > $qtyNeeded) {
                            $validator->errors()->add(
                                "items.$i.vendors",
                                "Total order amount ($totalQtyOrdered) cannot exceed {$itemDescription} needed amount ({$qtyNeeded})."
                            );
                        }
                    }
                }
            });

            $validator->validate();
            return $validator->validated();
        
        // approver validations
        } elseif ($user->role === "approver") {
            $rules = [
                'status_id' => 'required|integer',
                'remarks' => $request->input('status_id') == 3 ? 'required|string' : 'nullable|string',
            ];

            $messages = [
                'status_id' => 'error: status_id not provided',
                'remarks.required' => 'You must add a remark for the rejected canvass',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);
            $validator->validate();
            return $validator->validated();
        }

        abort(403, 'Something went wrong: Unauthorized action');
    }

}