<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\Category;
use App\Services\Finance\FinanceSetupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function __construct(
        protected FinanceSetupService $financeSetupService
    ) {}

    /**
     * List user categories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::where('user_id', $request->user()->id);

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        $categories = $query->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Create a category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'uuid'],
            'name' => ['required', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:20'],
            'type' => ['nullable', 'string', 'in:expense,external_income,external_expense'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $category = Category::create([
            'id' => $validated['id'] ?? (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? '🏷️',
            'color' => $validated['color'] ?? '#607D8B',
            'type' => $validated['type'] ?? 'expense',
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'message' => 'Category created',
            'data' => $category,
        ], 201);
    }

    /**
     * Update an existing category.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $category = Category::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:20'],
            'type' => ['sometimes', 'string', 'in:expense,external_income,external_expense'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated',
            'data' => $category,
        ]);
    }

    /**
     * Soft delete a category.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $category = Category::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $category->delete();

        return response()->json([
            'message' => 'Category deleted',
        ]);
    }

    /**
     * Seed default categories for user.
     */
    public function seedDefaults(Request $request): JsonResponse
    {
        $this->financeSetupService->seedDefaultCategories($request->user());

        $categories = Category::where('user_id', $request->user()->id)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'message' => 'Default categories generated',
            'data' => $categories,
        ]);
    }
}
