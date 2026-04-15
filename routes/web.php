<?php

use App\Http\Controllers\DashboardCategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardProjectController;
use App\Http\Controllers\DashboardTechstackController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\TwoFactorOnboardingController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectsController;
use Illuminate\Support\Facades\Route;


Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/projects', [ProjectsController::class, 'index'])->name('projects');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');

Route::middleware('auth')->group(function () {
    Route::get('/verify-email', function () {
        return redirect()->route('auth.two-factor-onboarding.show');
    })->name('verification.notice');

    Route::get('/register/two-factor-setup', [TwoFactorOnboardingController::class, 'show'])
        ->name('auth.two-factor-onboarding.show');
    Route::post('/register/two-factor-setup/enable', [TwoFactorOnboardingController::class, 'enable'])
        ->name('auth.two-factor-onboarding.enable');
    Route::post('/register/two-factor-setup', [TwoFactorOnboardingController::class, 'store'])
        ->name('auth.two-factor-onboarding.store');
});

// Route::inertia('/welcome', 'welcome', [
//     'canRegister' => Features::enabled(Features::registration()),
// ])->name('welcome');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('dashboard/techstacks', [DashboardTechstackController::class, 'store'])->name('dashboard.techstacks.store');
    Route::patch('dashboard/techstacks/{techstack}', [DashboardTechstackController::class, 'update'])->name('dashboard.techstacks.update');
    Route::delete('dashboard/techstacks/{techstack}', [DashboardTechstackController::class, 'destroy'])->name('dashboard.techstacks.destroy');

    Route::post('dashboard/categories', [DashboardCategoryController::class, 'store'])->name('dashboard.categories.store');
    Route::patch('dashboard/categories/{category}', [DashboardCategoryController::class, 'update'])->name('dashboard.categories.update');
    Route::delete('dashboard/categories/{category}', [DashboardCategoryController::class, 'destroy'])->name('dashboard.categories.destroy');

    Route::post('dashboard/projects', [DashboardProjectController::class, 'store'])->name('dashboard.projects.store');
    Route::post('dashboard/projects/upload-temp-image', [DashboardProjectController::class, 'uploadTempImage'])->name('dashboard.projects.upload-temp-image');
    Route::delete('dashboard/projects/upload-temp-image', [DashboardProjectController::class, 'deleteTempImage'])->name('dashboard.projects.delete-temp-image');
    Route::patch('dashboard/projects/{project}', [DashboardProjectController::class, 'update'])->name('dashboard.projects.update');
    Route::delete('dashboard/projects/{project}', [DashboardProjectController::class, 'destroy'])->name('dashboard.projects.destroy');
});

require __DIR__.'/settings.php';
