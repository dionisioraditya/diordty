<?php

use App\Models\Finance\Category;
use App\Models\Finance\Transaction;
use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('sync endpoint rejects malformed payload with 422', function () {
    $response = $this->postJson('/api/v1/finance/sync', [
        'push' => [
            'transactions' => [
                [
                    'id' => 'not-a-valid-uuid',
                    'name' => 'Bad ID Transaction',
                    'amount' => 'invalid-amount',
                    'transaction_date' => 'bad-date',
                ],
            ],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors([
            'push.transactions.0.id',
            'push.transactions.0.amount',
            'push.transactions.0.transaction_date',
        ]);
});

test('sync endpoint ignores other users category_id in pushed transactions safely', function () {
    $otherCategory = Category::create([
        'user_id' => $this->otherUser->id,
        'name' => 'Victim Category',
        'type' => 'expense',
    ]);

    $txId = (string) Str::uuid();

    $response = $this->postJson('/api/v1/finance/sync', [
        'push' => [
            'transactions' => [
                [
                    'id' => $txId,
                    'name' => 'Sync Transaction with Foreign Category',
                    'amount' => 75000,
                    'transaction_date' => '2026-10-02',
                    'category_id' => $otherCategory->id,
                ],
            ],
        ],
    ]);

    $response->assertOk();

    // Transaction should be saved, but category_id should be safely sanitized to null
    $this->assertDatabaseHas('finance_transactions', [
        'id' => $txId,
        'user_id' => $this->user->id,
        'category_id' => null,
    ]);
});

test('sync endpoint handles cross-user UUID collision without crashing or overwriting', function () {
    $foreignTxId = (string) Str::uuid();

    // Create a transaction owned by the other user
    Transaction::create([
        'id' => $foreignTxId,
        'user_id' => $this->otherUser->id,
        'name' => 'Victim Private Transaction',
        'amount' => 1000000,
        'transaction_date' => '2026-10-01',
    ]);

    // Current user attempts to push a transaction with the same UUID
    $response = $this->postJson('/api/v1/finance/sync', [
        'push' => [
            'transactions' => [
                [
                    'id' => $foreignTxId,
                    'name' => 'Collision Attempt',
                    'amount' => 5000,
                    'transaction_date' => '2026-10-02',
                ],
            ],
        ],
    ]);

    $response->assertOk();

    // Victim transaction must remain intact and untouched
    $this->assertDatabaseHas('finance_transactions', [
        'id' => $foreignTxId,
        'user_id' => $this->otherUser->id,
        'name' => 'Victim Private Transaction',
    ]);
});
