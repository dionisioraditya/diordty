<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Finance\FinanceSetupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected FinanceSetupService $financeSetupService
    ) {}

    /**
     * Register a new user account.
     */
    public function register(Request $request): JsonResponse
    {
        // 1. Check if public registration is disabled
        if (config('app.allow_registration', env('ALLOW_REGISTRATION', true)) === false) {
            return response()->json([
                'message' => 'Public registration is currently disabled.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers()],
        ]);

        // 2. Check if email whitelist is enabled
        $whitelistStr = env('ALLOWED_REGISTRATION_EMAILS', '');
        if (! empty($whitelistStr)) {
            $allowedEmails = array_map('strtolower', array_filter(array_map('trim', explode(',', $whitelistStr))));
            if (! in_array(strtolower($validated['email']), $allowedEmails, true)) {
                return response()->json([
                    'message' => 'Registration is restricted to authorized email addresses.',
                ], 403);
            }
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
        ]);

        // Seed default categories for this user so they can start budgeting immediately
        $this->financeSetupService->seedDefaultCategories($user);

        $token = $user->createToken('personal-finance-mobile')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    /**
     * Login and obtain a Sanctum Bearer token.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        // Clean up tokens older than 30 days
        $user->tokens()->where('created_at', '<', now()->subDays(30))->delete();

        // Ensure defaults exist
        $this->financeSetupService->seedDefaultCategories($user);

        $token = $user->createToken('personal-finance-mobile')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Logout and revoke the active token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }
}
