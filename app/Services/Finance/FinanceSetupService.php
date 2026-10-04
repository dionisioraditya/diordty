<?php

namespace App\Services\Finance;

use App\Models\Finance\Category;
use App\Models\User;
use Illuminate\Support\Str;

class FinanceSetupService
{
    /**
     * Seed standard default categories for a user if they don't have any yet.
     */
    public function seedDefaultCategories(User $user): void
    {
        $existingCount = Category::where('user_id', $user->id)->count();
        if ($existingCount > 0) {
            return;
        }

        $defaults = [
            // Expense categories (Operating budget)
            [
                'name' => 'Foods',
                'icon' => '🍽️',
                'color' => '#FF9800',
                'type' => 'expense',
                'sort_order' => 1,
            ],
            [
                'name' => 'Wants',
                'icon' => '🎮',
                'color' => '#9C27B0',
                'type' => 'expense',
                'sort_order' => 2,
            ],
            [
                'name' => 'Infrastructure',
                'icon' => '🛠️',
                'color' => '#607D8B',
                'type' => 'expense',
                'sort_order' => 3,
            ],
            [
                'name' => 'Transports',
                'icon' => '🚗',
                'color' => '#2196F3',
                'type' => 'expense',
                'sort_order' => 4,
            ],
            [
                'name' => 'Savings',
                'icon' => '💰',
                'color' => '#4CAF50',
                'type' => 'expense',
                'sort_order' => 5,
            ],
            [
                'name' => 'Lainnya',
                'icon' => '📦',
                'color' => '#795548',
                'type' => 'expense',
                'sort_order' => 6,
            ],

            // External Profit & Asset Inflow / Outflow categories (Cold wallet)
            [
                'name' => 'Reksadana',
                'icon' => '📈',
                'color' => '#009688',
                'type' => 'external_income',
                'sort_order' => 10,
            ],
            [
                'name' => 'Side Hustle',
                'icon' => '💼',
                'color' => '#3F51B5',
                'type' => 'external_income',
                'sort_order' => 11,
            ],
            [
                'name' => 'Transfer Masuk',
                'icon' => '📥',
                'color' => '#4CAF50',
                'type' => 'external_income',
                'sort_order' => 12,
            ],
            [
                'name' => 'Beli Asset/Gear',
                'icon' => '💻',
                'color' => '#E91E63',
                'type' => 'external_expense',
                'sort_order' => 13,
            ],
            [
                'name' => 'Lainnya Eksternal',
                'icon' => '🌐',
                'color' => '#9E9E9E',
                'type' => 'external_expense',
                'sort_order' => 14,
            ],
        ];

        foreach ($defaults as $item) {
            Category::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'name' => $item['name'],
                'icon' => $item['icon'],
                'color' => $item['color'],
                'type' => $item['type'],
                'sort_order' => $item['sort_order'],
            ]);
        }
    }
}
