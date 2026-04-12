<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DashboardProjectController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateProject($request);
        $techstackIds = $data['techstack_ids'] ?? [];
        unset($data['techstack_ids']);

        $project = Project::create($data);
        $project->techstacks()->sync($techstackIds);

        return back();
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $data = $this->validateProject($request, $project);
        $techstackIds = $data['techstack_ids'] ?? [];
        unset($data['techstack_ids']);

        $project->update($data);
        $project->techstacks()->sync($techstackIds);

        return back();
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateProject(Request $request, ?Project $project = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'demo_link' => ['nullable', 'string', 'max:2048'],
            'github_link' => ['nullable', 'string', 'max:2048'],
            'video_link' => ['nullable', 'string', 'max:2048'],
            'info' => ['nullable', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'techstack_ids' => ['nullable', 'array'],
            'techstack_ids.*' => ['integer', 'exists:techstacks,id'],
        ]);

        $data['slug'] = $this->generateUniqueSlug($data['title'], $project?->id);

        return $data;
    }

    private function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug !== '' ? $baseSlug : 'project';
        $counter = 2;

        while (
            Project::query()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
