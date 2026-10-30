<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated admin users can visit the dashboard', function () {
    $user = User::factory()->create([
        'role' => 'admin',
    ]);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('non-admin authenticated users cannot visit the dashboard', function () {
    $user = User::factory()->create([
        'role' => 'user',
    ]);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertForbidden();
});