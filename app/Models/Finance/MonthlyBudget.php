<?php

namespace App\Models\Finance;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyBudget extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'finance_monthly_budgets';

    protected $fillable = [
        'id',
        'user_id',
        'month',
        'total_budget',
    ];

    protected function casts(): array
    {
        return [
            'total_budget' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categoryBudgets(): HasMany
    {
        return $this->hasMany(CategoryBudget::class, 'monthly_budget_id');
    }
}
