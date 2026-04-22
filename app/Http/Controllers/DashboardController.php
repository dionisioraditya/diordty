<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Project;
use App\Models\Techstack;
use App\Support\ProjectImageUpload;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'techstacks' => Techstack::query()
                ->select('id', 'name', 'slug', 'icon')
                ->orderBy('name')
                ->get(),
            'categories' => Category::query()
                ->select('id', 'name', 'slug', 'color')
                ->orderBy('name')
                ->get(),
            'projects' => Project::query()
                ->with([
                    'category:id,name,slug,color',
                    'techstacks:id,name,slug,icon',
                ])
                ->latest()
                ->get(),
            'projectImageUpload' => [
                'maxBytes' => ProjectImageUpload::maxBytes(),
                'maxKilobytes' => ProjectImageUpload::maxKilobytes(),
                'maxMegabytesLabel' => ProjectImageUpload::maxMegabytesLabel(),
            ],
        ]);
    }
}
