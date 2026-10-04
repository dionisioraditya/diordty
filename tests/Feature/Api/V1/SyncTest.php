<?php

use App\Models\Finance\Category;
use App\Models\Finance\Transaction;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('android offline sync can batch push categories and transactions generated offline', function () {
    $offlineCategoryId = (string) Str::uuid();
    $offlineTxId = (string) Str::uuid();

    $payload = [
        'last_sync_timestamp' => null,
        'push' => [
            'categories' => [
                [
                    'id' => $offlineCategoryId,
                    'name' => 'Offline Groceries',
                    'icon' => '🛒',
                    'color' => '#4CAF50',
                    'type' => 'expense',
                    'sort_order' => 1,
                ],
            ],
            'transactions' => [
                [
                    'id' => $offlineTxId,
                    'category_id' => $offlineCategoryId,
                    'wallet_type' => 'monthly_budget',
                    'transaction_type' => 'expense',
                    'name' => 'Belanja Supermarket',
                    'amount' => 125000,
                    'transaction_date' => '2026-09-18',
                    'notes' => 'Offline recorded',
                ],
            ],
        ],
    ];

    $response = $this->postJson('/api/v1/finance/sync', $payload);

    $response->assertOk()
        ->assertJsonStructure([
            'server_time',
            'pull' => ['categories', 'monthly_budgets', 'category_budgets', 'transactions', 'rollovers'],
        ]);

    $this->assertDatabaseHas('finance_categories', [
        'id' => $offlineCategoryId,
        'user_id' => $this->user->id,
        'name' => 'Offline Groceries',
    ]);

    $this->assertDatabaseHas('finance_transactions', [
        'id' => $offlineTxId,
        'user_id' => $this->user->id,
        'name' => 'Belanja Supermarket',
        'amount' => 125000,
    ]);
});

test('android sync performs incremental pull using last_sync_timestamp', function () {
    $cat1 = Category::create([
        'user_id' => $this->user->id,
        'name' => 'Existing Cat',
        'type' => 'expense',
    ]);

    // Fast-forward or simulate sync timestamp
    $pastTime = now()->subMinutes(10)->toIso8601String();

    $response = $this->postJson('/api/v1/finance/sync', [
        'last_sync_timestamp' => $pastTime,
        'push' => [],
    ]);

    $response->assertOk();
    $pulledCategories = collect($response->json('pull.categories'));
    expect($pulledCategories->contains('id', $cat1->id))->toBeTrue();

    // With future timestamp, nothing should be returned
    $futureTime = now()->addMinutes(10)->toIso8601String();
    $futureResponse = $this->postJson('/api/v1/finance/sync', [
        'last_sync_timestamp' => $futureTime,
        'push' => [],
    ]);

    $futureCategories = collect($futureResponse->json('pull.categories'));
    expect($futureCategories->count())->toBe(0);
});

test('offline deletion soft-deletes records on server', function () {
    $tx = Transaction::create([
        'user_id' => $this->user->id,
        'name' => 'To be deleted offline',
        'amount' => 50000,
        'transaction_date' => '2026-09-10',
    ]);

    $payload = [
        'push' => [
            'transactions' => [
                [
                    'id' => $tx->id,
                    'name' => 'To be deleted offline',
                    'deleted_at' => now()->toIso8601String(),
                ],
            ],
        ],
    ];

    $response = $this->postJson('/api/v1/finance/sync', $payload);
    $response->assertOk();

    $this->assertSoftDeleted('finance_transactions', [
        'id' => $tx->id,
    ]);
});
