<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\CanvassSheet;
use App\Models\Item;
use App\Models\Vendor;
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
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.qty_needed' => 'required|integer|min:1',
            'items.*.vendors' => 'array',
        ]);

        $user = $request->user();

        DB::beginTransaction();

        try {
            $canvass = CanvassSheet::create([
                'created_by' => $user->username,
                'status_id' => 1,
                'remarks' => null,
            ]);

            foreach ($validated['items'] as $item) {
                $itemModel = Item::where('description', $item['description'])->firstOrFail();

                $canvassItem = $canvass->items()->create([
                    'item_id' => $itemModel->id,
                    'qty_needed' => $item['qty_needed'],
                ]);

                foreach ($item['vendors'] ?? [] as $vendorData) {
                    $vendor = Vendor::where('name', $vendorData['vendor_name'])->firstOrFail();

                    $canvassItem->vendors()->create([
                        'vendor_id' => $vendor->id,
                        'quote' => $vendorData['price'] ?? 0,
                        'stock' => $vendorData['stock'] ?? 0,
                        'qty_order' => $vendorData['amount'] ?? 0,
                        'remarks' => $vendorData['remarks'] ?? null,
                    ]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Canvass created successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to save canvass sheet',
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
}