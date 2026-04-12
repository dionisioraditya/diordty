<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Project;
use App\Models\Techstack;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        $techstacks = Techstack::all();

        Project::factory(10)
            ->recycle($categories)
            ->create()
            ->each(function (Project $project) use ($techstacks): void {
                $project->techstacks()->attach(
                    $techstacks->random(rand(1, min(3, $techstacks->count())))->pluck('id')->all()
                );
            });
    }
}
