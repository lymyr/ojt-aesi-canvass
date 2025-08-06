<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $query = Vendor::orderBy('created_at', 'desc');

        if ($request->has('limit')) {
            $perPage = (int) $request->input('limit', 16);
            $vendors = $query->paginate($perPage);

            return response()->json([
                'data' => $vendors->items(),
                'meta' => [
                    'total' => $vendors->total(),
                    'current_page' => $vendors->currentPage(),
                    'last_page' => $vendors->lastPage(),
                ],
            ]);
        }

        return response()->json(['data' => $query->get()]);
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

    public function getVendor($id)
    {
        return Vendor::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $vendor = Vendor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|unique:vendors,name,' . $id,
            'address' => 'required|string',
            'tin' => 'required|string',
            'remarks' => 'nullable|string',
            'active' => 'required|boolean',
        ]);

        $vendor->update($validated);

        return response()->json($vendor);
    }
}