<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\BudgetRollover;
use App\Models\Finance\MonthlyBudget;
use App\Models\Finance\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ColdWalletController extends Controller
{
    /**
     * Get Cold Wallet summary: Total Saldo, Akumulasi Sisa Bulanan, Total Profit Eksternal (Net).
     * Replicates the KPI cards from the Cold Wallet sheet.
     */
    public function summary(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // 1. Akumulasi Sisa Anggaran Bulanan yang sudah ditransfer
        $accumulatedRollover = (float) BudgetRollover::where('user_id', $userId)
            ->where('is_transferred', true)
            ->sum('remaining_amount');

        // 2. Mutasi Eksternal (Inflow & Outflow)
        $externalInflow = (float) Transaction::where('user_id', $userId)
            ->where('wallet_type', 'cold_wallet')
            ->where('transaction_type', 'external_inflow')
            ->sum('amount');

        $externalOutflow = (float) Transaction::where('user_id', $userId)
            ->where('wallet_type', 'cold_wallet')
            ->where('transaction_type', 'external_outflow')
            ->sum('amount');

        $netExternalProfit = $externalInflow - $externalOutflow;
        $totalColdWalletBalance = $accumulatedRollover + $netExternalProfit;

        return response()->json([
            'total_cold_wallet_balance' => $totalColdWalletBalance,
            'accumulated_monthly_remaining' => $accumulatedRollover,
            'total_external_profit_net' => $netExternalProfit,
            'external_inflow' => $externalInflow,
            'external_outflow' => $externalOutflow,
        ]);
    }

    /**
     * List monthly budget rollovers (Akumulasi Sisa Budget Bulanan).
     */
    public function rollovers(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Ensure all months with a budget have a rollover entry computed
        $monthsWithBudget = MonthlyBudget::where('user_id', $userId)->pluck('month')->all();

        foreach ($monthsWithBudget as $m) {
            $this->recomputeRolloverForMonth($userId, $m);
        }

        $rollovers = BudgetRollover::where('user_id', $userId)
            ->orderBy('month', 'desc')
            ->get();

        $totalTransferred = $rollovers->where('is_transferred', true)->sum('remaining_amount');
        $transferredCount = $rollovers->where('is_transferred', true)->count();

        return response()->json([
            'total_transferred_amount' => (float) $totalTransferred,
            'transferred_count' => $transferredCount,
            'data' => $rollovers,
        ]);
    }

    /**
     * Toggle the "Transfer?" checkbox for a specific month.
     */
    public function toggleTransfer(Request $request, string $month): JsonResponse
    {
        if (! preg_match('/^\d{4}-\d{2}$/', $month)) {
            return response()->json(['message' => 'Invalid month format, expected YYYY-MM'], 422);
        }

        $userId = $request->user()->id;
        $rollover = $this->recomputeRolloverForMonth($userId, $month);

        $validated = $request->validate([
            'is_transferred' => ['nullable', 'boolean'],
        ]);

        $newStatus = array_key_exists('is_transferred', $validated)
            ? (bool) $validated['is_transferred']
            : ! $rollover->is_transferred;

        $rollover->is_transferred = $newStatus;
        $rollover->transferred_at = $newStatus ? now() : null;
        $rollover->save();

        return response()->json([
            'message' => 'Transfer status updated',
            'rollover' => $rollover,
        ]);
    }

    /**
     * List external profit & asset mutations (Buku Mutasi Profit & Alokasi Dana Eksternal).
     */
    public function mutations(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $mutations = Transaction::with('category')
            ->where('user_id', $userId)
            ->where('wallet_type', 'cold_wallet')
            ->whereIn('transaction_type', ['external_inflow', 'external_outflow'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate((int) $request->query('per_page', 50));

        return response()->json($mutations);
    }

    /**
     * Helper to compute or refresh remaining budget for a month.
     */
    protected function recomputeRolloverForMonth(int|string $userId, string $month): BudgetRollover
    {
        return BudgetRollover::recomputeForMonth($userId, $month);
    }
}
