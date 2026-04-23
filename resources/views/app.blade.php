<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Force the dark theme immediately to avoid any light-mode flash. --}}
        <script>
            (function() {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
            })();
        </script>

        {{-- Inline style to keep the dark background before CSS fully loads. --}}
        <style>
            html {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/icon_profile.png" type="image/png">
        <link rel="apple-touch-icon" href="/icon_profile.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
