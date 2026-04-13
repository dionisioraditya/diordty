<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Techstack;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', [
            'categories' => Category::query()
                ->select('id', 'name', 'slug', 'color')
                ->orderBy('name')
                ->get(),
            'techstack' => Techstack::query()
                ->select('id', 'name', 'slug', 'icon')
                ->orderBy('name')
                ->get(),
        ]);
    }
}
