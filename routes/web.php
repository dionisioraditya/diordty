<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectsController;
use Illuminate\Support\Facades\Route;


Route::inertia('/', 'Home')->name('home');

Route::get('/projects', [ProjectsController::class, 'index'])->name('projects');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');

// Route::inertia('/welcome', 'welcome', [
//     'canRegister' => Features::enabled(Features::registration()),
// ])->name('welcome');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
