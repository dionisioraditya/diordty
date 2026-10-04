<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Disable SMTP email verification notifications in favor of TOTP onboarding.
     */
    public function sendEmailVerificationNotification(): void
    {
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function financeCategories(): HasMany
    {
        return $this->hasMany(\App\Models\Finance\Category::class);
    }

    public function financeMonthlyBudgets(): HasMany
    {
        return $this->hasMany(\App\Models\Finance\MonthlyBudget::class);
    }

    public function financeTransactions(): HasMany
    {
        return $this->hasMany(\App\Models\Finance\Transaction::class);
    }

    public function financeBudgetRollovers(): HasMany
    {
        return $this->hasMany(\App\Models\Finance\BudgetRollover::class);
    }
}
