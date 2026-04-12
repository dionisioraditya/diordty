<?php

namespace App\Http\Responses;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Fortify;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function toResponse($request)
    {
        $redirectTo = $request->user() instanceof MustVerifyEmail
            ? route('verification.notice')
            : Fortify::redirects('register');

        return $request->wantsJson()
            ? new JsonResponse('', 201)
            : redirect()->intended($redirectTo);
    }
}
