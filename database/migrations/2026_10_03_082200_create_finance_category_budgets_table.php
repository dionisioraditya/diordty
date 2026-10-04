<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finance_category_budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('monthly_budget_id')->constrained('finance_monthly_budgets')->cascadeOnDelete();
            $table->foreignUuid('category_id')->constrained('finance_categories')->cascadeOnDelete();
            $table->decimal('allocated_amount', 15, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['monthly_budget_id', 'category_id']);
            $table->index(['user_id', 'monthly_budget_id']);
            $table->index(['user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finance_category_budgets');
    }
};
