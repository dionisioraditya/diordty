<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(rand(3, 5));
        return [
            'title' => $title,
            'slug' => str()->slug($title),
            'image' => fake()->imageUrl(),
            'description' => fake()->paragraph(),
            'github_link' => fake()->url(),
            'video_link' => fake()->url(),
            'category_id' => Category::factory(),
        ];
    }
}
