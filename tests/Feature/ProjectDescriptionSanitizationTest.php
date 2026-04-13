<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('project descriptions are sanitized before storing from dashboard', function () {
    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($user);

    $response = $this->post(route('dashboard.projects.store'), [
        'title' => 'Rich Text Project',
        'description' => '<p>Hello <strong>world</strong></p><script>alert(1)</script><p><a href="javascript:alert(1)" target="_blank">Bad link</a></p>',
    ]);

    $response->assertRedirect();

    $project = Project::query()->where('title', 'Rich Text Project')->firstOrFail();

    expect($project->description)
        ->toContain('<strong>world</strong>')
        ->toContain('Bad link')
        ->not->toContain('alert(1)')
        ->not->toContain('<script>')
        ->not->toContain('javascript:alert(1)');
});

test('project detail page sanitizes existing stored html before rendering', function () {
    $project = Project::factory()->create([
        'title' => 'Unsafe Project',
        'description' => '<p>Safe</p><img src="x" onerror="alert(1)"><script>alert(1)</script>',
    ]);

    $response = $this->get(route('projects.show', $project->slug));

    $response->assertOk();
    $response->assertSee('Safe');
    $response->assertDontSee('alert(1)', false);
    $response->assertDontSee('onerror=', false);
    $response->assertSee('"description":"<p>Safe<\\/p>"', false);
});
