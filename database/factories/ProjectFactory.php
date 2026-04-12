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
        $img = "/wallpaper.jpg";
        $githubLink = "https://github.com/dionisioraditya/agv_ws";
        $videoLink = "https://youtu.be/KcNXDKpNqNw?si=NL5yFm-pXUo7W94v";
        return [
            'title' => $title,
            'slug' => str()->slug($title),
            'image' => $img,
            'description' => fake()->paragraph(),
            'demo_link' => fake()->url(),
            'github_link' => $githubLink,
            'video_link' => $videoLink,
            'info' => fake()->sentence(rand(10, 20)),
            'category_id' => Category::factory(),
        ];
    }
}
