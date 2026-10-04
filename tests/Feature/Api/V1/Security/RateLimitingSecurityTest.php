<?php

use App\Models\User;

test('login endpoint enforces rate limiting after excessive attempts', function () {
    $user = User::factory()->create([
        'email' => 'ratelimit@example.com',
        'password' => bcrypt('Secret123!'),
    ]);

    // Send 10 failed login attempts (allowed by throttle:10,1)
    for ($i = 0; $i < 10; $i++) {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'ratelimit@example.com',
            'password' => 'WrongPassword',
        ]);
    }

    // 11th attempt should trigger 429 Too Many Requests
    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'ratelimit@example.com',
        'password' => 'WrongPassword',
    ]);

    $response->assertStatus(429);
});
