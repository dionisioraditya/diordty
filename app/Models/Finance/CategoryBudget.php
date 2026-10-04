<?php

namespace App\Models\Finance;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryBudget extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'finance_category_budgets';

    protected $fillable = [
        'id',
        'user_id',
        'monthly_budget_id',
        'category_id',
        'allocated_amount',
    ];

    protected function casts(): array
    {
        return [
            'allocated_amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function monthlyBudget(): BelongsTo
    {
        return $this->belongsTo(MonthlyBudget::class, 'monthly_budget_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
