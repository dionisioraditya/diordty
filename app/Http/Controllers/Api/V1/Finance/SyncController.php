<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\BudgetRollover;
use App\Models\Finance\Category;
use App\Models\Finance\CategoryBudget;
use App\Models\Finance\MonthlyBudget;
use App\Models\Finance\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SyncController extends Controller
{
    /**
     * Batch Sync endpoint for Android WorkManager (Offline-First).
     * Pushes pending changes from local Room DB, then pulls server updates.
     */
    public function sync(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $now = now();

        $push = $request->input('push', []);
        $lastSyncTimestamp = $request->input('last_sync_timestamp');

        // Process Push within a transaction
        DB::transaction(function () use ($push, $userId) {
            // 1. Categories
            if (! empty($push['categories'])) {
                foreach ($push['categories'] as $item) {
                    $id = $item['id'] ?? (string) Str::uuid();
                    if (! empty($item['deleted_at'])) {
                        Category::where('user_id', $userId)->where('id', $id)->delete();
                    } else {
                        Category::withTrashed()->updateOrCreate(
                            ['id' => $id, 'user_id' => $userId],
                            [
                                'name' => $item['name'],
                                'icon' => $item['icon'] ?? null,
                                'color' => $item['color'] ?? null,
                                'type' => $item['type'] ?? 'expense',
                                'sort_order' => $item['sort_order'] ?? 0,
                                'deleted_at' => null,
                            ]
                        );
                    }
                }
            }

            // 2. Monthly Budgets & Allocations
            if (! empty($push['budgets'])) {
                foreach ($push['budgets'] as $item) {
                    $id = $item['id'] ?? (string) Str::uuid();
                    if (! empty($item['deleted_at'])) {
                        MonthlyBudget::where('user_id', $userId)->where('id', $id)->delete();
                    } else {
                        $budget = MonthlyBudget::withTrashed()->updateOrCreate(
                            ['id' => $id, 'user_id' => $userId],
                            [
                                'month' => $item['month'],
                                'total_budget' => $item['total_budget'],
                                'deleted_at' => null,
                            ]
                        );

                        if (! empty($item['allocations'])) {
                            foreach ($item['allocations'] as $alloc) {
                                $allocId = $alloc['id'] ?? (string) Str::uuid();
                                if (! empty($alloc['deleted_at'])) {
                                    CategoryBudget::where('user_id', $userId)->where('id', $allocId)->delete();
                                } else {
                                    CategoryBudget::withTrashed()->updateOrCreate(
                                        [
                                            'monthly_budget_id' => $budget->id,
                                            'category_id' => $alloc['category_id'],
                                        ],
                                        [
                                            'id' => $allocId,
                                            'user_id' => $userId,
                                            'allocated_amount' => $alloc['allocated_amount'],
                                            'deleted_at' => null,
                                        ]
                                    );
                                }
                            }
                        }
                    }
                }
            }

            // 3. Transactions
            if (! empty($push['transactions'])) {
                foreach ($push['transactions'] as $item) {
                    $id = $item['id'] ?? (string) Str::uuid();
                    if (! empty($item['deleted_at'])) {
                        Transaction::where('user_id', $userId)->where('id', $id)->delete();
                    } else {
                        Transaction::withTrashed()->updateOrCreate(
                            ['id' => $id, 'user_id' => $userId],
                            [
                                'category_id' => $item['category_id'] ?? null,
                                'wallet_type' => $item['wallet_type'] ?? 'monthly_budget',
                                'transaction_type' => $item['transaction_type'] ?? 'expense',
                                'name' => $item['name'],
                                'amount' => $item['amount'],
                                'transaction_date' => $item['transaction_date'],
                                'receipt_url' => $item['receipt_url'] ?? null,
                                'notes' => $item['notes'] ?? null,
                                'deleted_at' => null,
                            ]
                        );
                    }
                }
            }

            // 4. Rollovers
            if (! empty($push['rollovers'])) {
                foreach ($push['rollovers'] as $item) {
                    $id = $item['id'] ?? (string) Str::uuid();
                    if (! empty($item['deleted_at'])) {
                        BudgetRollover::where('user_id', $userId)->where('id', $id)->delete();
                    } else {
                        BudgetRollover::withTrashed()->updateOrCreate(
                            ['user_id' => $userId, 'month' => $item['month']],
                            [
                                'id' => $id,
                                'remaining_amount' => $item['remaining_amount'],
                                'is_transferred' => $item['is_transferred'] ?? false,
                                'transferred_at' => ! empty($item['is_transferred']) ? ($item['transferred_at'] ?? now()) : null,
                                'deleted_at' => null,
                            ]
                        );
                    }
                }
            }
        });

        // Auto-recompute rollovers for all months with a budget (Option 1: Live Rollover)
        $monthsWithBudget = MonthlyBudget::where('user_id', $userId)->pluck('month')->all();
        foreach ($monthsWithBudget as $m) {
            BudgetRollover::recomputeForMonth($userId, $m);
        }

        // Process Pull (Incremental query by updated_at)
        $pullDate = null;
        if (! empty($lastSyncTimestamp)) {
            try {
                $pullDate = Carbon::parse($lastSyncTimestamp);
            } catch (\Exception $e) {
                $pullDate = null;
            }
        }

        $categoriesQuery = Category::withTrashed()->where('user_id', $userId);
        $budgetsQuery = MonthlyBudget::withTrashed()->where('user_id', $userId);
        $categoryBudgetsQuery = CategoryBudget::withTrashed()->where('user_id', $userId);
        $transactionsQuery = Transaction::withTrashed()->where('user_id', $userId);
        $rolloversQuery = BudgetRollover::withTrashed()->where('user_id', $userId);

        if ($pullDate) {
            $categoriesQuery->where('updated_at', '>', $pullDate);
            $budgetsQuery->where('updated_at', '>', $pullDate);
            $categoryBudgetsQuery->where('updated_at', '>', $pullDate);
            $transactionsQuery->where('updated_at', '>', $pullDate);
            $rolloversQuery->where('updated_at', '>', $pullDate);
        } else {
            // Initial sync: only pull non-deleted records
            $categoriesQuery->whereNull('deleted_at');
            $budgetsQuery->whereNull('deleted_at');
            $categoryBudgetsQuery->whereNull('deleted_at');
            $transactionsQuery->whereNull('deleted_at');
            $rolloversQuery->whereNull('deleted_at');
        }

        return response()->json([
            'server_time' => $now->toIso8601String(),
            'pull' => [
                'categories' => $categoriesQuery->get(),
                'monthly_budgets' => $budgetsQuery->get(),
                'category_budgets' => $categoryBudgetsQuery->get(),
                'transactions' => $transactionsQuery->get(),
                'rollovers' => $rolloversQuery->get(),
            ],
        ]);
    }
}
