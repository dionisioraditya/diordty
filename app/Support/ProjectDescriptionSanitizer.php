<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMXPath;

class ProjectDescriptionSanitizer
{
    /**
     * @var list<string>
     */
    private const REMOVE_WITH_CONTENT = [
        'iframe',
        'math',
        'noscript',
        'object',
        'script',
        'style',
        'svg',
    ];

    /**
     * @var array<string, list<string>>
     */
    private const ALLOWED_TAGS = [
        'a' => ['href', 'target', 'rel'],
        'blockquote' => ['class'],
        'br' => [],
        'code' => ['class'],
        'em' => [],
        'h1' => ['class'],
        'h2' => ['class'],
        'h3' => ['class'],
        'li' => ['class'],
        'ol' => ['class'],
        'p' => ['class'],
        'pre' => ['class'],
        's' => [],
        'strong' => [],
        'u' => [],
        'ul' => ['class'],
    ];

    public static function sanitize(?string $html): ?string
    {
        if ($html === null) {
            return null;
        }

        $html = trim($html);

        if ($html === '') {
            return null;
        }

        $previousValue = libxml_use_internal_errors(true);

        $document = new DOMDocument('1.0', 'UTF-8');
        $document->loadHTML(
            mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'),
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        $xpath = new DOMXPath($document);

        foreach ($xpath->query('//comment()') ?: [] as $comment) {
            $comment->parentNode?->removeChild($comment);
        }

        self::sanitizeNode($document, $document);

        $sanitized = trim($document->saveHTML() ?: '');

        libxml_clear_errors();
        libxml_use_internal_errors($previousValue);

        return $sanitized !== '' ? $sanitized : null;
    }

    private static function sanitizeNode(DOMDocument $document, DOMNode $node): void
    {
        for ($child = $node->firstChild; $child !== null; $child = $nextSibling) {
            $nextSibling = $child->nextSibling;

            if ($child instanceof DOMElement) {
                if (! array_key_exists($child->tagName, self::ALLOWED_TAGS)) {
                    if (in_array($child->tagName, self::REMOVE_WITH_CONTENT, true)) {
                        $child->parentNode?->removeChild($child);

                        continue;
                    }

                    self::unwrapNode($document, $child);

                    continue;
                }

                self::sanitizeAttributes($child);
            }

            self::sanitizeNode($document, $child);
        }
    }

    private static function unwrapNode(DOMDocument $document, DOMElement $element): void
    {
        $parent = $element->parentNode;

        if ($parent === null) {
            return;
        }

        while ($element->firstChild !== null) {
            $parent->insertBefore($element->firstChild, $element);
        }

        $parent->removeChild($element);
    }

    private static function sanitizeAttributes(DOMElement $element): void
    {
        $allowedAttributes = self::ALLOWED_TAGS[$element->tagName];

        for ($index = $element->attributes->length - 1; $index >= 0; $index--) {
            $attribute = $element->attributes->item($index);

            if ($attribute === null || ! in_array($attribute->nodeName, $allowedAttributes, true)) {
                if ($attribute !== null) {
                    $element->removeAttribute($attribute->nodeName);
                }

                continue;
            }

            if ($attribute->nodeName === 'href') {
                self::sanitizeHrefAttribute($element, $attribute->nodeValue);
            }

            if ($attribute->nodeName === 'target' && $attribute->nodeValue !== '_blank') {
                $element->removeAttribute('target');
            }

            if ($attribute->nodeName === 'rel') {
                $element->setAttribute('rel', 'noopener noreferrer');
            }

            if ($attribute->nodeName === 'class') {
                self::sanitizeClassAttribute($element);
            }
        }

        if ($element->tagName === 'a' && $element->getAttribute('target') === '_blank') {
            $element->setAttribute('rel', 'noopener noreferrer');
        }
    }

    private static function sanitizeHrefAttribute(DOMElement $element, string $href): void
    {
        $href = trim($href);

        if ($href === '') {
            $element->removeAttribute('href');

            return;
        }

        if (preg_match('/^(https?:|mailto:|tel:|\/|#)/i', $href) !== 1) {
            $element->removeAttribute('href');
            $element->removeAttribute('target');
            $element->removeAttribute('rel');

            return;
        }

        $element->setAttribute('href', $href);
    }

    private static function sanitizeClassAttribute(DOMElement $element): void
    {
        $classes = preg_split('/\s+/', trim($element->getAttribute('class'))) ?: [];
        $allowedClasses = array_filter($classes, function (string $class): bool {
            return preg_match('/^ql-align-(center|right|justify)$/', $class) === 1
                || preg_match('/^ql-indent-[1-9]$/', $class) === 1;
        });

        if ($allowedClasses === []) {
            $element->removeAttribute('class');

            return;
        }

        $element->setAttribute('class', implode(' ', $allowedClasses));
    }
}
