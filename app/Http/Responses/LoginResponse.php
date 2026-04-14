<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function toResponse($request)
    {
        $user = $request->user();

        $redirectTo = $user !== null
            && is_null($user->email_verified_at)
            && ! is_null($user->two_factor_secret)
            && is_null($user->two_factor_confirmed_at)
                ? route('auth.two-factor-onboarding.show')
                : Fortify::redirects('login');

        return $request->wantsJson()
            ? new JsonResponse('', 200)
            : redirect()->intended($redirectTo);
    }
}
