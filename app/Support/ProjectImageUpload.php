<?php

namespace App\Support;

class ProjectImageUpload
{
    private const DEFAULT_MAX_BYTES = 52_428_800; // 50 MB

    public static function maxBytes(): int
    {
        return min(
            self::DEFAULT_MAX_BYTES,
            self::iniBytes('upload_max_filesize'),
            self::iniBytes('post_max_size'),
        );
    }

    public static function maxKilobytes(): int
    {
        return intdiv(self::maxBytes(), 1024);
    }

    public static function maxMegabytesLabel(): string
    {
        $megabytes = self::maxBytes() / 1024 / 1024;

        if (fmod($megabytes, 1.0) === 0.0) {
            return (string) (int) $megabytes;
        }

        return number_format($megabytes, 1, '.', '');
    }

    private static function iniBytes(string $key): int
    {
        $value = trim((string) ini_get($key));

        if ($value === '') {
            return self::DEFAULT_MAX_BYTES;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        $number = (float) $value;
        $unit = strtolower(substr($value, -1));

        return match ($unit) {
            'g' => (int) ($number * 1024 * 1024 * 1024),
            'm' => (int) ($number * 1024 * 1024),
            'k' => (int) ($number * 1024),
            default => (int) $number,
        };
    }
}
