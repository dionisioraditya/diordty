<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function toResponse($request)
    {
        $redirectTo = route('auth.two-factor-onboarding.show');

        return $request->wantsJson()
            ? new JsonResponse('', 201)
            : redirect()->intended($redirectTo);
    }
}
