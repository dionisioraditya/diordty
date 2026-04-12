<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
            'color' => 'bg-green-100'
        ]);
        Category::create([
            'name' => 'Mobile Development',
            'slug' => 'mobile-development',
            'color' => 'bg-blue-100'
        ]);
        Category::create([
            'name' => 'Machine Learning',
            'slug' => 'machine-learning',
            'color' => 'bg-yellow-100'
        ]);
        Category::create([
            'name' => 'Robotics',
            'slug' => 'robotics',
            'color' => 'bg-purple-100'
        ]);
    }
}
