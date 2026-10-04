<?php

use App\Models\Finance\Category;
use App\Models\User;

test('user can register and receive sanctum token with default categories seeded', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Dionisius Raditya',
        'email' => 'dion@example.com',
        'password' => 'secret12345',
    ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'message',
            'token',
            'user' => ['id', 'name', 'email', 'role'],
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'dion@example.com',
    ]);

    $user = User::where('email', 'dion@example.com')->first();
    expect(Category::where('user_id', $user->id)->count())->toBeGreaterThan(0);
});

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'family@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'family@example.com',
        'password' => 'password123',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'message',
            'token',
            'user' => ['id', 'name', 'email'],
        ]);
});

test('user cannot login with invalid password', function () {
    User::factory()->create([
        'email' => 'family@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'family@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('authenticated user can view their profile via me endpoint', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/v1/auth/me');

    $response->assertOk()
        ->assertJson([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
            ],
        ]);
});

test('authenticated user can logout and revoke token', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/auth/logout');

    $response->assertOk()
        ->assertJson(['message' => 'Successfully logged out']);

    expect($user->tokens()->count())->toBe(0);
});

test('registration is blocked when email is not in whitelist', function () {
    putenv('ALLOWED_REGISTRATION_EMAILS=owner@diordty.tech,me@example.com');

    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Stranger',
        'email' => 'hacker@evil.com',
        'password' => 'secret12345',
    ]);

    $response->assertStatus(403)
        ->assertJson(['message' => 'Registration is restricted to authorized email addresses.']);

    // Reset env
    putenv('ALLOWED_REGISTRATION_EMAILS=');
});

test('registration succeeds when email is in whitelist', function () {
    putenv('ALLOWED_REGISTRATION_EMAILS=owner@diordty.tech,me@example.com');

    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Owner',
        'email' => 'owner@diordty.tech',
        'password' => 'secret12345',
    ]);

    $response->assertCreated();

    // Reset env
    putenv('ALLOWED_REGISTRATION_EMAILS=');
});

