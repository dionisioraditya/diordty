<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class TwoFactorOnboardingController extends Controller
{
    /**
     * Show the two-factor onboarding screen.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user instanceof MustVerifyEmail && $user->hasVerifiedEmail()) {
            return redirect()->intended(Fortify::redirects('login'));
        }

        return Inertia::render('auth/two-factor-onboarding', [
            'requiresConfirmation' => Features::optionEnabled(
                Features::twoFactorAuthentication(),
                'confirm',
            ),
            'hasPendingSetup' => ! is_null($user?->two_factor_secret),
            'qrCodeSvg' => $user?->two_factor_secret
                ? $user->twoFactorQrCodeSvg()
                : null,
            'manualSetupKey' => $user?->two_factor_secret
                ? Fortify::currentEncrypter()->decrypt($user->two_factor_secret)
                : null,
        ]);
    }

    /**
     * Generate authenticator setup data for users who do not have a secret yet.
     */
    public function enable(
        Request $request,
        EnableTwoFactorAuthentication $enable,
    ): RedirectResponse {
        $enable($request->user(), true);

        return redirect()->route('auth.two-factor-onboarding.show');
    }

    /**
     * Confirm the user's authenticator setup and mark the account as verified.
     */
    public function store(
        Request $request,
        ConfirmTwoFactorAuthentication $confirm,
    ): RedirectResponse {
        $validated = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        try {
            $confirm($request->user(), $validated['code']);
        } catch (ValidationException) {
            throw ValidationException::withMessages([
                'code' => __('The provided two factor authentication code was invalid.'),
            ]);
        }

        $user = $request->user();

        if ($user instanceof MustVerifyEmail && ! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect()->intended(Fortify::redirects('login'));
    }
}
