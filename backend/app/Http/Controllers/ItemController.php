<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Uom;

class ItemController extends Controller
{
    public function index()
    {
        return response()->json(Item::all());
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
            'unit' => $uom->unit, // denormalized value
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return response()->json($item, 201);
    }
}
