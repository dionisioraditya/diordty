<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\Category;
use App\Models\Finance\CategoryBudget;
use App\Models\Finance\MonthlyBudget;
use App\Models\Finance\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BudgetController extends Controller
{
    /**
     * Get monthly budget breakdown, spending, and remaining per category.
     * Matches the format of the Google Sheet monthly tab (e.g. September 2026).
     */
    public function show(Request $request, string $month): JsonResponse
    {
        if (! preg_match('/^\d{4}-\d{2}$/', $month)) {
            return response()->json(['message' => 'Invalid month format, expected YYYY-MM'], 422);
        }

        $userId = $request->user()->id;

        // 1. Fetch monthly budget header if exists
        $monthlyBudget = MonthlyBudget::where('user_id', $userId)
            ->where('month', $month)
            ->first();

        $totalBudget = $monthlyBudget ? (float) $monthlyBudget->total_budget : 0.0;

        // 2. Fetch category allocations for this month
        $allocations = [];
        if ($monthlyBudget) {
            $allocations = CategoryBudget::where('monthly_budget_id', $monthlyBudget->id)
                ->pluck('allocated_amount', 'category_id')
                ->all();
        }

        // 3. Fetch all active expense categories for this user
        $categories = Category::where('user_id', $userId)
            ->where('type', 'expense')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        // 4. Calculate actual spending per category in this month (Indexed DB query)
        $startOfMonth = $month.'-01';
        $endOfMonth = Carbon::parse($startOfMonth)->endOfMonth()->toDateString();

        $spendingQuery = Transaction::where('user_id', $userId)
            ->where('wallet_type', 'monthly_budget')
            ->where('transaction_type', 'expense')
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->select('category_id', DB::raw('SUM(amount) as total_spent'))
            ->groupBy('category_id')
            ->pluck('total_spent', 'category_id')
            ->all();

        $totalSpending = 0.0;
        $categoryBreakdown = [];

        foreach ($categories as $cat) {
            $allocated = isset($allocations[$cat->id]) ? (float) $allocations[$cat->id] : 0.0;
            $spent = isset($spendingQuery[$cat->id]) ? (float) $spendingQuery[$cat->id] : 0.0;
            $remaining = $allocated - $spent;
            $percentage = $allocated > 0 ? round(($spent / $allocated) * 100, 2) : 0.0;

            $totalSpending += $spent;

            $categoryBreakdown[] = [
                'category_id' => $cat->id,
                'name' => $cat->name,
                'icon' => $cat->icon,
                'color' => $cat->color,
                'allocated_amount' => $allocated,
                'spending' => $spent,
                'remaining' => $remaining,
                'percentage' => $percentage,
            ];
        }

        $overallRemaining = $totalBudget - $totalSpending;

        return response()->json([
            'month' => $month,
            'monthly_budget_id' => $monthlyBudget?->id,
            'total_budget' => $totalBudget,
            'total_spending' => $totalSpending,
            'remaining' => $overallRemaining,
            'categories' => $categoryBreakdown,
        ]);
    }

    /**
     * Store or update budget allocations for a month.
     */
    public function storeOrUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'uuid'],
            'month' => ['required', 'regex:/^\d{4}-\d{2}$/'],
            'total_budget' => ['required', 'numeric', 'min:0'],
            'allocations' => ['nullable', 'array'],
            'allocations.*.category_id' => ['required_with:allocations', 'uuid', 'exists:finance_categories,id'],
            'allocations.*.allocated_amount' => ['required_with:allocations', 'numeric', 'min:0'],
        ]);

        $userId = $request->user()->id;
        $month = $validated['month'];

        $budget = DB::transaction(function () use ($validated, $userId, $month) {
            $monthlyBudget = MonthlyBudget::updateOrCreate(
                [
                    'user_id' => $userId,
                    'month' => $month,
                ],
                [
                    'id' => $validated['id'] ?? (string) Str::uuid(),
                    'total_budget' => $validated['total_budget'],
                ]
            );

            if (! empty($validated['allocations'])) {
                foreach ($validated['allocations'] as $item) {
                    CategoryBudget::updateOrCreate(
                        [
                            'monthly_budget_id' => $monthlyBudget->id,
                            'category_id' => $item['category_id'],
                        ],
                        [
                            'user_id' => $userId,
                            'allocated_amount' => $item['allocated_amount'],
                        ]
                    );
                }
            }

            return $monthlyBudget;
        });

        return $this->show($request, $month);
    }
}
