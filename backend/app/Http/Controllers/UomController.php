<?php

namespace App\Http\Controllers;

use App\Models\Uom;
use Illuminate\Http\Request;

class UomController extends Controller
{
    public function index()
    {
        $uoms = Uom::all();
        return response()->json($uoms);
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
}
