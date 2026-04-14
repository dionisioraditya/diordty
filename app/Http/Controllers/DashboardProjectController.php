<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Support\ProjectDescriptionSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DashboardProjectController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateProject($request);
        $techstackIds = $data['techstack_ids'] ?? [];
        unset($data['techstack_ids']);
        $data['image'] = $this->moveTempImageToFinal($data['image'] ?? null);

        $project = Project::create($data);
        $project->techstacks()->sync($techstackIds);

        return back();
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $data = $this->validateProject($request, $project);
        $techstackIds = $data['techstack_ids'] ?? [];
        unset($data['techstack_ids']);
        $nextImage = $data['image'] ?? null;
        $currentImage = $project->image;

        if ($nextImage !== null) {
            $data['image'] = $this->moveTempImageToFinal($nextImage);

            if (
                $currentImage !== null &&
                $currentImage !== '' &&
                $currentImage !== $data['image']
            ) {
                $this->deleteStoredImage($currentImage);
            }
        } else {
            unset($data['image']);
        }

        $project->update($data);
        $project->techstacks()->sync($techstackIds);

        return back();
    }

    public function uploadTempImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image_file' => ['required', 'file', 'mimes:png,jpg,jpeg', 'max:51200'],
        ]);

        $path = $validated['image_file']->store('temp', $this->projectImagesDiskName());

        return response()->json([
            'path' => $path,
            'url' => $this->projectImagesDisk()->url($path),
            'original_name' => $validated['image_file']->getClientOriginalName(),
        ]);
    }

    public function deleteTempImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
        ]);

        $path = $validated['path'];

        if ($this->isTempPath($path) && $this->projectImagesDisk()->exists($path)) {
            $this->projectImagesDisk()->delete($path);
        }

        return response()->json(['deleted' => true]);
    }

    public function destroy(Project $project): RedirectResponse
    {
        if ($project->image) {
            $this->deleteStoredImage($project->image);
        }

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

        $data['description'] = ProjectDescriptionSanitizer::sanitize(
            $data['description'] ?? null,
        );

        if (($data['image'] ?? null) !== null && $data['image'] !== '') {
            if (!$this->isTempPath($data['image'])) {
                throw ValidationException::withMessages([
                    'image' => 'Uploaded image reference is invalid.',
                ]);
            }

            if (!$this->projectImagesDisk()->exists($data['image'])) {
                throw ValidationException::withMessages([
                    'image' => 'Uploaded image could not be found in temporary storage.',
                ]);
            }
        } else {
            $data['image'] = null;
        }

        $data['slug'] = $this->generateUniqueSlug($data['title'], $project?->id);

        return $data;
    }

    private function moveTempImageToFinal(?string $tempPath): ?string
    {
        if ($tempPath === null || $tempPath === '') {
            return null;
        }

        if (!$this->isTempPath($tempPath)) {
            throw ValidationException::withMessages([
                'image' => 'Uploaded image reference is invalid.',
            ]);
        }

        if (!$this->projectImagesDisk()->exists($tempPath)) {
            throw ValidationException::withMessages([
                'image' => 'Uploaded image could not be found in temporary storage.',
            ]);
        }

        $extension = pathinfo($tempPath, PATHINFO_EXTENSION);
        $finalPath = sprintf('img/%s.%s', (string) Str::uuid(), $extension);

        $this->projectImagesDisk()->move($tempPath, $finalPath);

        return $finalPath;
    }

    private function isTempPath(string $path): bool
    {
        return str_starts_with($path, 'temp/');
    }

    private function deleteStoredImage(string $path): void
    {
        if ($this->projectImagesDisk()->exists($path)) {
            $this->projectImagesDisk()->delete($path);
        }
    }

    private function projectImagesDiskName(): string
    {
        return (string) config('filesystems.project_images_disk', 'public');
    }

    private function projectImagesDisk(): FilesystemAdapter
    {
        return Storage::disk($this->projectImagesDiskName());
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
