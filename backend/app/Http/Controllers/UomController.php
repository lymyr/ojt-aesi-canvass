<?php

namespace App\Http\Controllers;

use App\Models\Uom;
use Illuminate\Http\Request;

class UomController extends Controller
{
    public function index(Request $request)
    {
        $query = Uom::orderBy('created_at', 'desc');
        if ($request->has('limit')) {
            $perPage = (int) $request->input('limit', 16);
            $uoms = $query->paginate($perPage);

            return response()->json([
                'data' => $uoms->items(),
                'meta' => [
                    'total' => $uoms->total(),
                    'current_page' => $uoms->currentPage(),
                    'last_page' => $uoms->lastPage(),
                ],
            ]);
        }
        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit' => 'required|string',
            'abbreviation' => 'required|string',
        ]);

        $uom = Uom::create($validated);

        return response()->json($uom, 201);
    }

    public function getUom($id)
    {
        return Uom::findOrFail($id);
    }
}
