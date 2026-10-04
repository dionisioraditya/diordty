<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class SyncRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'last_sync_timestamp' => ['nullable', 'date'],
            'push' => ['nullable', 'array'],

            // Categories
            'push.categories' => ['nullable', 'array', 'max:200'],
            'push.categories.*.id' => ['required', 'uuid'],
            'push.categories.*.deleted_at' => ['nullable', 'string'],
            'push.categories.*.name' => ['required_without:push.categories.*.deleted_at', 'nullable', 'string', 'max:255'],
            'push.categories.*.icon' => ['nullable', 'string', 'max:100'],
            'push.categories.*.color' => ['nullable', 'string', 'max:50'],
            'push.categories.*.type' => ['nullable', 'string', 'in:expense,income,both'],
            'push.categories.*.sort_order' => ['nullable', 'integer'],

            // Monthly Budgets
            'push.budgets' => ['nullable', 'array', 'max:200'],
            'push.budgets.*.id' => ['required', 'uuid'],
            'push.budgets.*.deleted_at' => ['nullable', 'string'],
            'push.budgets.*.month' => ['required_without:push.budgets.*.deleted_at', 'nullable', 'regex:/^\d{4}-\d{2}$/'],
            'push.budgets.*.total_budget' => ['required_without:push.budgets.*.deleted_at', 'nullable', 'numeric', 'min:0', 'max:999999999999.99'],
            'push.budgets.*.allocations' => ['nullable', 'array', 'max:100'],
            'push.budgets.*.allocations.*.id' => ['nullable', 'uuid'],
            'push.budgets.*.allocations.*.deleted_at' => ['nullable', 'string'],
            'push.budgets.*.allocations.*.category_id' => ['required_without:push.budgets.*.allocations.*.deleted_at', 'nullable', 'uuid'],
            'push.budgets.*.allocations.*.allocated_amount' => ['required_without:push.budgets.*.allocations.*.deleted_at', 'nullable', 'numeric', 'min:0', 'max:999999999999.99'],

            // Transactions
            'push.transactions' => ['nullable', 'array', 'max:200'],
            'push.transactions.*.id' => ['required', 'uuid'],
            'push.transactions.*.deleted_at' => ['nullable', 'string'],
            'push.transactions.*.category_id' => ['nullable', 'uuid'],
            'push.transactions.*.wallet_type' => ['nullable', 'string', 'in:monthly_budget,cold_wallet'],
            'push.transactions.*.transaction_type' => ['nullable', 'string', 'in:expense,external_inflow,external_outflow,rollover_to_cold_wallet'],
            'push.transactions.*.name' => ['required_without:push.transactions.*.deleted_at', 'nullable', 'string', 'max:255'],
            'push.transactions.*.amount' => ['required_without:push.transactions.*.deleted_at', 'nullable', 'numeric', 'min:0.01', 'max:999999999999.99'],
            'push.transactions.*.transaction_date' => ['required_without:push.transactions.*.deleted_at', 'nullable', 'date_format:Y-m-d'],
            'push.transactions.*.receipt_url' => ['nullable', 'url', 'max:1000'],
            'push.transactions.*.notes' => ['nullable', 'string', 'max:5000'],

            // Rollovers
            'push.rollovers' => ['nullable', 'array', 'max:200'],
            'push.rollovers.*.id' => ['required', 'uuid'],
            'push.rollovers.*.deleted_at' => ['nullable', 'string'],
            'push.rollovers.*.month' => ['required_without:push.rollovers.*.deleted_at', 'nullable', 'regex:/^\d{4}-\d{2}$/'],
            'push.rollovers.*.remaining_amount' => ['nullable', 'numeric', 'min:0', 'max:999999999999.99'],
            'push.rollovers.*.is_transferred' => ['nullable', 'boolean'],
            'push.rollovers.*.transferred_at' => ['nullable', 'date'],
        ];
    }
}
