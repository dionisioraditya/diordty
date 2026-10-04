<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finance_budget_rollovers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('month', 7); // 'YYYY-MM'
            $table->decimal('remaining_amount', 15, 2)->default(0);
            $table->boolean('is_transferred')->default(false);
            $table->timestamp('transferred_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['user_id', 'month']);
            $table->index(['user_id', 'is_transferred']);
            $table->index(['user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finance_budget_rollovers');
    }
};
