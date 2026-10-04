<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Finance\BudgetController;
use App\Http\Controllers\Api\V1\Finance\CategoryController;
use App\Http\Controllers\Api\V1\Finance\ColdWalletController;
use App\Http\Controllers\Api\V1\Finance\SyncController;
use App\Http\Controllers\Api\V1\Finance\TransactionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth endpoints
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    // Finance endpoints (authenticated)
    Route::middleware('auth:sanctum')->prefix('finance')->group(function () {
        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        Route::post('/categories/seed-defaults', [CategoryController::class, 'seedDefaults']);

        // Monthly Budgets
        Route::get('/budgets/{month}', [BudgetController::class, 'show']);
        Route::post('/budgets', [BudgetController::class, 'storeOrUpdate']);

        // Transactions
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::get('/transactions/{id}', [TransactionController::class, 'show']);
        Route::put('/transactions/{id}', [TransactionController::class, 'update']);
        Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);

        // Cold Wallet
        Route::prefix('cold-wallet')->group(function () {
            Route::get('/summary', [ColdWalletController::class, 'summary']);
            Route::get('/rollovers', [ColdWalletController::class, 'rollovers']);
            Route::post('/rollovers/{month}/transfer', [ColdWalletController::class, 'toggleTransfer']);
            Route::get('/mutations', [ColdWalletController::class, 'mutations']);
        });

        // Offline-First Sync
        Route::post('/sync', [SyncController::class, 'sync']);
    });
});
