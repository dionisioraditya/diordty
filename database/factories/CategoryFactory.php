<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories_name = fake()->sentence(rand(1,3), false);
        return [
            'name' => $categories_name,
            'slug' => Str::slug($categories_name),
            'color' => 'bg-gray-100'
        ];
    }
}
