<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    /**
     * List transactions with flexible filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $query = Transaction::with('category')
            ->where('user_id', $userId);

        if ($request->filled('month')) {
            $month = $request->query('month');
            if (preg_match('/^\d{4}-\d{2}$/', $month)) {
                $startOfMonth = $month.'-01';
                $endOfMonth = Carbon::parse($startOfMonth)->endOfMonth()->toDateString();
                $query->whereBetween('transaction_date', [$startOfMonth, $endOfMonth]);
            }
        }

        if ($request->filled('wallet_type')) {
            $query->where('wallet_type', $request->query('wallet_type'));
        }

        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->query('transaction_type'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('start_date')) {
            $query->whereDate('transaction_date', '>=', $request->query('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('transaction_date', '<=', $request->query('end_date'));
        }

        if ($request->filled('search')) {
            $search = '%'.strtolower($request->query('search')).'%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(notes) LIKE ?', [$search]);
            });
        }

        $perPage = min((int) $request->query('per_page', 50), 100);

        $transactions = $query->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($transactions);
    }

    /**
     * Store a new transaction.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'uuid'],
            'category_id' => ['nullable', 'uuid', 'exists:finance_categories,id'],
            'wallet_type' => ['nullable', 'string', 'in:monthly_budget,cold_wallet'],
            'transaction_type' => ['nullable', 'string', 'in:expense,external_inflow,external_outflow,rollover_to_cold_wallet'],
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'transaction_date' => ['required', 'date_format:Y-m-d'],
            'receipt_url' => ['nullable', 'string', 'max:1000'],
            'notes' => ['nullable', 'string'],
        ]);

        $transaction = Transaction::create([
            'id' => $validated['id'] ?? (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'] ?? null,
            'wallet_type' => $validated['wallet_type'] ?? 'monthly_budget',
            'transaction_type' => $validated['transaction_type'] ?? 'expense',
            'name' => $validated['name'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'receipt_url' => $validated['receipt_url'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        $transaction->load('category');

        return response()->json([
            'message' => 'Transaction created',
            'data' => $transaction,
        ], 201);
    }

    /**
     * Show a transaction detail.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $transaction = Transaction::with('category')
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json([
            'data' => $transaction,
        ]);
    }

    /**
     * Update an existing transaction.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'category_id' => ['nullable', 'uuid', 'exists:finance_categories,id'],
            'wallet_type' => ['sometimes', 'string', 'in:monthly_budget,cold_wallet'],
            'transaction_type' => ['sometimes', 'string', 'in:expense,external_inflow,external_outflow,rollover_to_cold_wallet'],
            'name' => ['sometimes', 'string', 'max:255'],
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'transaction_date' => ['sometimes', 'date_format:Y-m-d'],
            'receipt_url' => ['nullable', 'string', 'max:1000'],
            'notes' => ['nullable', 'string'],
        ]);

        $transaction->update($validated);
        $transaction->load('category');

        return response()->json([
            'message' => 'Transaction updated',
            'data' => $transaction,
        ]);
    }

    /**
     * Soft delete a transaction.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted',
        ]);
    }
}
