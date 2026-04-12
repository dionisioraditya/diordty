<?php

namespace Database\Seeders;

use App\Models\Techstack;
use Illuminate\Database\Seeder;

class TechstackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Techstack::create([
            'name' => 'Laravel',
            'slug' => 'laravel',
            'icon' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
        ]);
        Techstack::create([
            'name' => 'React',
            'slug' => 'react',
            'icon' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        ]);
        Techstack::create([
            'name' => 'Flutter',
            'slug' => 'flutter',
            'icon' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
        ]);
        Techstack::create([
            'name' => 'ROS2',
            'slug' => 'ros2',
            'icon' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-plain.svg',
        ]);
        Techstack::create([
            'name' => 'TensorFlow',
            'slug' => 'tensorflow',
            'icon' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
        ]);
    }
}
