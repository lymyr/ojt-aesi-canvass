<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Uom;

class ItemController extends Controller
{
   public function index(Request $request)
    {
        $query = Item::with('uom:id,id,abbreviation')->orderBy('created_at', 'desc');

        if ($request->has('limit')) {
            $perPage = (int) $request->input('limit', 16);
            $paginated = $query->paginate($perPage);

            return response()->json([
                'data' => $paginated->items(),
                'meta' => [
                    'total' => $paginated->total(),
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                ],
            ]);
        }
        return response()->json(['data' => $query->get()]);
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
