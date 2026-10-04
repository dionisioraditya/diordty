<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finance_monthly_budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('month', 7); // 'YYYY-MM', e.g. '2026-09'
            $table->decimal('total_budget', 15, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['user_id', 'month']);
            $table->index(['user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finance_monthly_budgets');
    }
};
