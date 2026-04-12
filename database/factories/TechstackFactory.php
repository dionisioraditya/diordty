<?php

namespace Database\Factories;

use App\Models\Techstack;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Techstack>
 */
class TechstackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'icon' => fake()->imageUrl(64, 64, 'technics', true),
        ];
    }
}
