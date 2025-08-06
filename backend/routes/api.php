<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\UomController;
use App\Http\Controllers\CanvassSheetController;
use App\Models\LogData;

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'getUser']);
    Route::put('/users/{user}', [UserController::class, 'update']); // to do

    Route::get('/vendors', [VendorController::class, 'index']);
    Route::post('/vendors', [VendorController::class, 'store']);
    Route::get('/vendors/{id}', [VendorController::class, 'getVendor']);
    Route::put('/vendors/{id}', [VendorController::class, 'update']);

    Route::get('/items', [ItemController::class, 'index']);
    Route::post('/items', [ItemController::class, 'store']);
    Route::get('/items/{id}', [ItemController::class, 'getItem']);


    Route::get('/uoms', [UomController::class, 'index']);
    Route::post('/uoms', [UomController::class, 'store']);
    Route::get('/uoms/{id}', [UomController::class, 'getUom']);

    Route::get('/canvass-sheets', [CanvassSheetController::class, 'index']);
    Route::post('/canvass-sheets', [CanvassSheetController::class, 'save']);
    Route::get('/canvass/last-quote', [CanvassSheetController::class, 'getLastQuote']);
    Route::get('/canvass-sheets/{id}', [CanvassSheetController::class, 'getCanvass']);
    Route::put('/canvass-sheets/{id}', [CanvassSheetController::class, 'save']);

    Route::get('/changelog/{ref_table}/{ref_id}', function ($ref_table, $ref_id) {
        return LogData::where('ref_table', $ref_table)
            ->where('ref_id', $ref_id)
            ->orderBy('created_at', 'desc')
            ->get();
    });
});

