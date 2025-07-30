<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index()
    {
        return response()->json(Vendor::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'tin' => 'required|string',
            'remarks' => 'nullable|string',
        ]);

        $vendor = Vendor::create([
            ...$validated,
            'active' => true,
        ]);
        return response()->json($vendor, 201);
    }
}