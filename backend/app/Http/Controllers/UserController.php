<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('limit', 16);
        $users = User::select('id', 'username', 'role')
            ->orderBy('id', 'desc')
            ->paginate($perPage);
        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'total' => $users->total(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string',
            'isApprover' => 'boolean',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['isApprover'] ? 'approver' : 'maker',
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->only('id', 'username', 'role'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string',
            'isApprover' => 'boolean',
        ]);

        $user->username = $validated['username'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->role = $validated['isApprover'] ? 'approver' : 'maker';
        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->only('id', 'username', 'role'),
        ]);
    }

    public function getUser(User $user)
    {
        return response()->json($user->only('id', 'username', 'role'));
    }
}
