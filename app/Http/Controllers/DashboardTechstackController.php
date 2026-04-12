<?php

namespace App\Http\Controllers;

use App\Models\Techstack;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DashboardTechstackController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:2048'],
        ]);

        $data['slug'] = $this->generateUniqueSlug($data['name']);
        $data['icon'] = 'https://skillicons.dev/icons?i=' . strtolower($data['name']);
        Techstack::create($data);

        return back();
    }

    public function update(Request $request, Techstack $techstack): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:2048'],
        ]);
        $data['slug'] = $this->generateUniqueSlug($data['name'], $techstack->id);

        $techstack->update($data);

        return back();
    }

    public function destroy(Techstack $techstack): RedirectResponse
    {
        $techstack->delete();

        return back();
    }

    private function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug !== '' ? $baseSlug : 'techstack';
        $counter = 2;

        while (
            Techstack::query()
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
