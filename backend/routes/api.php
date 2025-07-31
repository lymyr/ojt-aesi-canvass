<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\UomController;
use App\Http\Controllers\CanvassSheetController;

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);

    Route::get('/vendors', [VendorController::class, 'index']);
    Route::post('/vendors', [VendorController::class, 'store']);

    Route::get('/items', [ItemController::class, 'index']);
    Route::post('/items', [ItemController::class, 'store']);

    Route::get('/uoms', [UomController::class, 'index']);
    Route::post('/uoms', [UomController::class, 'store']);

    Route::get('/canvass-sheets', [CanvassSheetController::class, 'index']);
    Route::post('/canvass-sheets', [CanvassSheetController::class, 'store']);
    Route::get('/canvass/last-quote', [CanvassSheetController::class, 'getLastQuote']);
});