<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'maker',
            'password' => Hash::make('123'),
            'role' => 'maker',
        ]);

        User::create([
            'username' => 'approver',
            'password' => Hash::make('123'),
            'role' => 'approver',
        ]);
        User::create([
            'username' => 'admin',
            'password' => Hash::make('123'),
            'role' => 'admin',
        ]);
    }
}
