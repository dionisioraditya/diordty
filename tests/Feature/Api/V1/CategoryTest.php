<?php

use App\Models\Finance\Category;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('user can list their own categories', function () {
    Category::create([
        'user_id' => $this->user->id,
        'name' => 'Foods',
        'icon' => '🍽️',
        'color' => '#FF9800',
        'type' => 'expense',
    ]);

    $response = $this->getJson('/api/v1/finance/categories');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Foods');
});

test('categories are strictly isolated between users', function () {
    $otherUser = User::factory()->create();

    Category::create([
        'user_id' => $otherUser->id,
        'name' => 'Secret Other Category',
        'icon' => '🔒',
        'type' => 'expense',
    ]);

    Category::create([
        'user_id' => $this->user->id,
        'name' => 'My Category',
        'icon' => '🍽️',
        'type' => 'expense',
    ]);

    $response = $this->getJson('/api/v1/finance/categories');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'My Category');
});

test('user can create a new category', function () {
    $response = $this->postJson('/api/v1/finance/categories', [
        'name' => 'Gaming & Hobbies',
        'icon' => '🎮',
        'color' => '#E91E63',
        'type' => 'expense',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Gaming & Hobbies');

    $this->assertDatabaseHas('finance_categories', [
        'user_id' => $this->user->id,
        'name' => 'Gaming & Hobbies',
    ]);
});

test('user can update their category', function () {
    $category = Category::create([
        'user_id' => $this->user->id,
        'name' => 'Old Name',
        'type' => 'expense',
    ]);

    $response = $this->putJson("/api/v1/finance/categories/{$category->id}", [
        'name' => 'Updated Name',
        'color' => '#123456',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated Name')
        ->assertJsonPath('data.color', '#123456');
});

test('user can soft delete their category', function () {
    $category = Category::create([
        'user_id' => $this->user->id,
        'name' => 'To Delete',
        'type' => 'expense',
    ]);

    $response = $this->deleteJson("/api/v1/finance/categories/{$category->id}");

    $response->assertOk();
    $this->assertSoftDeleted('finance_categories', [
        'id' => $category->id,
    ]);
});

test('user cannot update or delete other users category', function () {
    $otherUser = User::factory()->create();
    $otherCategory = Category::create([
        'user_id' => $otherUser->id,
        'name' => 'Other Category',
        'type' => 'expense',
    ]);

    $response = $this->deleteJson("/api/v1/finance/categories/{$otherCategory->id}");
    $response->assertNotFound();
});
