<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;
use PragmaRX\Google2FA\Google2FA;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());
});

test('two factor onboarding screen can be rendered for pending users', function () {
    $user = User::factory()->unverified()->create([
        'two_factor_secret' => encrypt('pending-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => null,
    ]);

    $this->actingAs($user)
        ->get(route('auth.two-factor-onboarding.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/two-factor-onboarding')
            ->where('hasPendingSetup', true)
            ->where('requiresConfirmation', true),
        );
});

test('pending users can complete authenticator onboarding', function () {
    $user = User::factory()->unverified()->create([
        'two_factor_secret' => encrypt(app(Google2FA::class)->generateSecretKey()),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => null,
    ]);

    $code = app(Google2FA::class)->getCurrentOtp(decrypt($user->two_factor_secret));

    $response = $this->actingAs($user)->post(route('auth.two-factor-onboarding.store'), [
        'code' => $code,
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));

    $user->refresh();

    expect($user->two_factor_confirmed_at)->not->toBeNull();
    expect($user->email_verified_at)->not->toBeNull();
});

test('invalid authenticator codes do not verify the account', function () {
    $user = User::factory()->unverified()->create([
        'two_factor_secret' => encrypt(app(Google2FA::class)->generateSecretKey()),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => null,
    ]);

    $response = $this->actingAs($user)
        ->from(route('auth.two-factor-onboarding.show'))
        ->post(route('auth.two-factor-onboarding.store'), [
            'code' => '000000',
        ]);

    $response
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('auth.two-factor-onboarding.show'));

    $user->refresh();

    expect($user->two_factor_confirmed_at)->toBeNull();
    expect($user->email_verified_at)->toBeNull();
});
