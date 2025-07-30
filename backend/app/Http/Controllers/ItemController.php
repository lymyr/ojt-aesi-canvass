<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Uom;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::with('uom:id,id,abbreviation')->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|unique:items,description',
            'unit_id' => 'required|exists:uoms,id',
            'remarks' => 'nullable|string',
        ]);

        $uom = Uom::findOrFail($validated['unit_id']); // fetch full UOM

        $item = Item::create([
            'description' => $validated['description'],
            'unit_id' => $uom->id,
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return response()->json($item->load('uom'), 201);
    }
}
