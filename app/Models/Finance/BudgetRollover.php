<?php

namespace App\Models\Finance;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BudgetRollover extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'finance_budget_rollovers';

    protected $fillable = [
        'id',
        'user_id',
        'month',
        'remaining_amount',
        'is_transferred',
        'transferred_at',
    ];

    protected function casts(): array
    {
        return [
            'remaining_amount' => 'decimal:2',
            'is_transferred' => 'boolean',
            'transferred_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function recomputeForMonth(int|string $userId, string $month): self
    {
        $monthlyBudget = MonthlyBudget::where('user_id', $userId)
            ->where('month', $month)
            ->first();

        $totalBudget = $monthlyBudget ? (float) $monthlyBudget->total_budget : 0.0;

        $startOfMonth = $month.'-01';
        $endOfMonth = \Carbon\Carbon::parse($startOfMonth)->endOfMonth()->toDateString();

        $totalSpent = (float) Transaction::where('user_id', $userId)
            ->where('wallet_type', 'monthly_budget')
            ->where('transaction_type', 'expense')
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $remaining = max(0.0, $totalBudget - $totalSpent);

        $rollover = self::withTrashed()->firstOrNew([
            'user_id' => $userId,
            'month' => $month,
        ]);

        if (! $rollover->exists) {
            $rollover->id = (string) \Illuminate\Support\Str::uuid();
            $rollover->is_transferred = false;
        }

        if (! $rollover->is_transferred) {
            $rollover->remaining_amount = $remaining;
        }
        $rollover->deleted_at = null;
        $rollover->save();

        return $rollover;
    }
}
