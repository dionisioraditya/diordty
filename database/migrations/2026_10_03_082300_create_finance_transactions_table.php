<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finance_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('category_id')->nullable()->constrained('finance_categories')->nullOnDelete();
            $table->string('wallet_type', 30)->default('monthly_budget'); // monthly_budget, cold_wallet
            $table->string('transaction_type', 30)->default('expense'); // expense, external_inflow, external_outflow, rollover_to_cold_wallet
            $table->string('name');
            $table->decimal('amount', 15, 2);
            $table->date('transaction_date');
            $table->string('receipt_url')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'wallet_type', 'transaction_date']);
            $table->index(['user_id', 'transaction_date']);
            $table->index(['user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finance_transactions');
    }
};
