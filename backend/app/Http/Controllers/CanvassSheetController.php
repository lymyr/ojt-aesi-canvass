<?php

namespace App\Http\Controllers;

use App\Models\CanvassSheet;
use App\Models\Item;
use App\Models\Vendor;
use Illuminate\Http\Request;

class CanvassSheetController extends Controller
{
    public function index()
    {
        $canvasses = CanvassSheet::with(['status', 'creator'])->latest();
        return response()->json($canvasses);
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

        // Step 1: Create the canvass sheet
        $canvass = CanvassSheet::create([
            'created_by' => $user->id,
            'status_id' => 1, // pending
            'remarks' => null,
        ]);

        foreach ($validated['items'] as $item) {
            // Find item by description
            $itemModel = Item::where('description', $item['description'])->firstOrFail();

            // Step 2: Add to canvass_items
            $canvassItem = $canvass->items()->create([
                'item_id' => $itemModel->id,
                'qty_needed' => $item['qty_needed'],
            ]);

            // Step 3: Add each vendor quote
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

        return response()->json(['message' => 'Canvass created successfully']);
    }

}
