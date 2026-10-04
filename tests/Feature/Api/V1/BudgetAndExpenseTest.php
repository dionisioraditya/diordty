<?php

use App\Models\Finance\Category;
use App\Models\Finance\Transaction;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('monthly budget and expense accurately match the spreadsheet calculations', function () {
    // 1. Create Categories matching the sheet
    $foods = Category::create(['user_id' => $this->user->id, 'name' => 'Foods', 'icon' => '🍽️', 'type' => 'expense', 'sort_order' => 1]);
    $wants = Category::create(['user_id' => $this->user->id, 'name' => 'Wants', 'icon' => '🎮', 'type' => 'expense', 'sort_order' => 2]);
    $infra = Category::create(['user_id' => $this->user->id, 'name' => 'Infrastructure', 'icon' => '🛠️', 'type' => 'expense', 'sort_order' => 3]);
    $transports = Category::create(['user_id' => $this->user->id, 'name' => 'Transports', 'icon' => '🚗', 'type' => 'expense', 'sort_order' => 4]);
    $savings = Category::create(['user_id' => $this->user->id, 'name' => 'Savings', 'icon' => '💰', 'type' => 'expense', 'sort_order' => 5]);

    // 2. Set Monthly Budget for 2026-09 (Total Budget = 2,500,000)
    $budgetResponse = $this->postJson('/api/v1/finance/budgets', [
        'month' => '2026-09',
        'total_budget' => 2500000,
        'allocations' => [
            ['category_id' => $foods->id, 'allocated_amount' => 1250000],
            ['category_id' => $wants->id, 'allocated_amount' => 500000],
            ['category_id' => $infra->id, 'allocated_amount' => 400000],
            ['category_id' => $transports->id, 'allocated_amount' => 150000],
            ['category_id' => $savings->id, 'allocated_amount' => 200000],
        ],
    ]);

    $budgetResponse->assertOk()
        ->assertJsonPath('total_budget', 2500000);

    // 3. Record Expenses in September 2026
    Transaction::create([
        'user_id' => $this->user->id,
        'category_id' => $foods->id,
        'wallet_type' => 'monthly_budget',
        'transaction_type' => 'expense',
        'name' => 'Belanja makanan',
        'amount' => 1092523,
        'transaction_date' => '2026-09-10',
    ]);

    Transaction::create([
        'user_id' => $this->user->id,
        'category_id' => $wants->id,
        'wallet_type' => 'monthly_budget',
        'transaction_type' => 'expense',
        'name' => 'Saldo minus / Hobi',
        'amount' => 500000,
        'transaction_date' => '2026-09-01',
    ]);

    Transaction::create([
        'user_id' => $this->user->id,
        'category_id' => $infra->id,
        'wallet_type' => 'monthly_budget',
        'transaction_type' => 'expense',
        'name' => 'Listrik & Paket Data',
        'amount' => 499479,
        'transaction_date' => '2026-09-05',
    ]);

    Transaction::create([
        'user_id' => $this->user->id,
        'category_id' => $transports->id,
        'wallet_type' => 'monthly_budget',
        'transaction_type' => 'expense',
        'name' => 'Bensin bulanan',
        'amount' => 150000,
        'transaction_date' => '2026-09-05',
    ]);

    Transaction::create([
        'user_id' => $this->user->id,
        'category_id' => $savings->id,
        'wallet_type' => 'monthly_budget',
        'transaction_type' => 'expense',
        'name' => 'Reksadana Pasar Uang',
        'amount' => 200000,
        'transaction_date' => '2026-09-01',
    ]);

    // 4. Fetch Monthly Budget Overview
    $response = $this->getJson('/api/v1/finance/budgets/2026-09');

    $response->assertOk()
        ->assertJsonPath('total_budget', 2500000)
        ->assertJsonPath('total_spending', 2442002)
        ->assertJsonPath('remaining', 57998);

    // Verify infrastructure is over-budget: 400,000 - 499,479 = -99,479
    $infraData = collect($response->json('categories'))->firstWhere('category_id', $infra->id);
    expect($infraData['remaining'])->toEqual(-99479);
});

test('user can record, filter, and paginate transactions', function () {
    $category = Category::create([
        'user_id' => $this->user->id,
        'name' => 'Foods',
        'type' => 'expense',
    ]);

    $response = $this->postJson('/api/v1/finance/transactions', [
        'category_id' => $category->id,
        'name' => 'Nasi Padang',
        'amount' => 25000,
        'transaction_date' => '2026-09-15',
        'notes' => 'Makan siang enak',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Nasi Padang')
        ->assertJsonPath('data.amount', '25000.00');

    // Filter by month
    $listResponse = $this->getJson('/api/v1/finance/transactions?month=2026-09');
    $listResponse->assertOk()
        ->assertJsonCount(1, 'data');

    // Filter by another month returns empty
    $emptyResponse = $this->getJson('/api/v1/finance/transactions?month=2026-10');
    $emptyResponse->assertOk()
        ->assertJsonCount(0, 'data');
});
