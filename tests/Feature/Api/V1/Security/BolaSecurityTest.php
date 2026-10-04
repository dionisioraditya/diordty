<?php

use App\Models\Finance\Category;
use App\Models\Finance\Transaction;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('user cannot create transaction with other users category_id (BOLA/IDOR protection)', function () {
    $otherCategory = Category::create([
        'user_id' => $this->otherUser->id,
        'name' => 'Victim Category',
        'type' => 'expense',
    ]);

    $response = $this->postJson('/api/v1/finance/transactions', [
        'name' => 'Malicious Transaction',
        'amount' => 50000,
        'transaction_date' => '2026-10-01',
        'category_id' => $otherCategory->id,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['category_id']);
});

test('user cannot update transaction with other users category_id (BOLA/IDOR protection)', function () {
    $myCategory = Category::create([
        'user_id' => $this->user->id,
        'name' => 'My Category',
        'type' => 'expense',
    ]);

    $otherCategory = Category::create([
        'user_id' => $this->otherUser->id,
        'name' => 'Victim Category',
        'type' => 'expense',
    ]);

    $transaction = Transaction::create([
        'user_id' => $this->user->id,
        'category_id' => $myCategory->id,
        'name' => 'Initial Expense',
        'amount' => 25000,
        'transaction_date' => '2026-10-01',
    ]);

    $response = $this->putJson("/api/v1/finance/transactions/{$transaction->id}", [
        'category_id' => $otherCategory->id,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['category_id']);
});

test('user cannot set budget allocation using other users category_id (BOLA/IDOR protection)', function () {
    $otherCategory = Category::create([
        'user_id' => $this->otherUser->id,
        'name' => 'Victim Category',
        'type' => 'expense',
    ]);

    $response = $this->postJson('/api/v1/finance/budgets', [
        'month' => '2026-10',
        'total_budget' => 5000000,
        'allocations' => [
            [
                'category_id' => $otherCategory->id,
                'allocated_amount' => 1000000,
            ],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['allocations.0.category_id']);
});
