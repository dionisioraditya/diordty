<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('admin can upload a temporary project image', function () {
    Storage::fake('public');

    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($user);

    $response = $this->post(route('dashboard.projects.upload-temp-image'), [
        'image_file' => UploadedFile::fake()->image('preview.jpg'),
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['path', 'url', 'original_name']);

    $path = $response->json('path');

    expect($path)->toStartWith('temp/');
    Storage::disk('public')->assertExists($path);
});

test('temporary project image upload validates file type and size', function () {
    Storage::fake('public');

    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($user);

    $this->post(route('dashboard.projects.upload-temp-image'), [
        'image_file' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
    ])->assertSessionHasErrors('image_file');

    $this->post(route('dashboard.projects.upload-temp-image'), [
        'image_file' => UploadedFile::fake()->image('huge.jpg')->size(51201),
    ])->assertSessionHasErrors('image_file');
});

test('creating a project moves uploaded image from temp to final storage', function () {
    Storage::fake('public');

    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($user);

    $uploadResponse = $this->post(route('dashboard.projects.upload-temp-image'), [
        'image_file' => UploadedFile::fake()->image('project.jpg'),
    ]);

    $tempPath = $uploadResponse->json('path');

    $response = $this->post(route('dashboard.projects.store'), [
        'title' => 'Image Upload Project',
        'image' => $tempPath,
        'description' => '<p>Project with uploaded image</p>',
    ]);

    $response->assertRedirect();

    $project = Project::query()->where('title', 'Image Upload Project')->firstOrFail();

    expect($project->image)->toStartWith('img/');
    Storage::disk('public')->assertMissing($tempPath);
    Storage::disk('public')->assertExists($project->image);
});
