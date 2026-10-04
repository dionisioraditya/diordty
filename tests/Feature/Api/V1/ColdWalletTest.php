<?php

use App\Models\Finance\MonthlyBudget;
use App\Models\Finance\Transaction;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('cold wallet summary matches the exact numbers from the google sheet', function () {
    // 1. Setup September 2026 Budget and Rollover
    MonthlyBudget::create([
        'user_id' => $this->user->id,
        'month' => '2026-09',
        'total_budget' => 2500000,
    ]);

    Transaction::create([
        'user_id' => $this->user->id,
        'wallet_type' => 'monthly_budget',
        'transaction_type' => 'expense',
        'name' => 'Total Expenses',
        'amount' => 2442002,
        'transaction_date' => '2026-09-20',
    ]);

    // Recompute and toggle transfer to true for 2026-09
    $this->postJson('/api/v1/finance/cold-wallet/rollovers/2026-09/transfer', [
        'is_transferred' => true,
    ])->assertOk();

    // 2. Setup External Inflows & Outflows from spreadsheet
    // Reksadana (+2,309,000)
    Transaction::create([
        'user_id' => $this->user->id,
        'wallet_type' => 'cold_wallet',
        'transaction_type' => 'external_inflow',
        'name' => 'Reksadana',
        'amount' => 2309000,
        'transaction_date' => '2026-09-25',
    ]);

    // Beli SSD 1 TB (-2,305,000)
    Transaction::create([
        'user_id' => $this->user->id,
        'wallet_type' => 'cold_wallet',
        'transaction_type' => 'external_outflow',
        'name' => 'Beli SSD 1 TB',
        'amount' => 2305000,
        'transaction_date' => '2026-10-01',
    ]);

    // Gaji asdos (+228,150)
    Transaction::create([
        'user_id' => $this->user->id,
        'wallet_type' => 'cold_wallet',
        'transaction_type' => 'external_inflow',
        'name' => 'Gaji asdos',
        'amount' => 228150,
        'transaction_date' => '2026-09-25',
    ]);

    // Transfer dari orang tua (+1,232,341)
    Transaction::create([
        'user_id' => $this->user->id,
        'wallet_type' => 'cold_wallet',
        'transaction_type' => 'external_inflow',
        'name' => 'Transfer dari orang tua',
        'amount' => 1232341,
        'transaction_date' => '2026-10-01',
    ]);

    // 3. Query Cold Wallet Summary
    $response = $this->getJson('/api/v1/finance/cold-wallet/summary');

    $response->assertOk()
        ->assertJsonPath('accumulated_monthly_remaining', 57998)
        ->assertJsonPath('total_external_profit_net', 1464491)
        ->assertJsonPath('total_cold_wallet_balance', 1522489);
});

test('user can list rollovers and toggle transfer status', function () {
    MonthlyBudget::create([
        'user_id' => $this->user->id,
        'month' => '2026-09',
        'total_budget' => 1000000,
    ]);

    // List rollovers auto-generates rollover record
    $response = $this->getJson('/api/v1/finance/cold-wallet/rollovers');
    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.remaining_amount', '1000000.00')
        ->assertJsonPath('data.0.is_transferred', false);

    // Toggle transfer
    $toggleResponse = $this->postJson('/api/v1/finance/cold-wallet/rollovers/2026-09/transfer', [
        'is_transferred' => true,
    ]);

    $toggleResponse->assertOk()
        ->assertJsonPath('rollover.is_transferred', true);

    $this->assertDatabaseHas('finance_budget_rollovers', [
        'user_id' => $this->user->id,
        'month' => '2026-09',
        'is_transferred' => true,
    ]);
});
