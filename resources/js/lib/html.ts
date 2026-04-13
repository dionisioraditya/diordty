const htmlEntityMap: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
};

export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ');
}

export function decodeHtmlEntities(text: string): string {
    return text.replace(
        /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g,
        (entity) => htmlEntityMap[entity] ?? entity,
    );
}

export function htmlToPlainText(html: string): string {
    return decodeHtmlEntities(stripHtml(html)).replace(/\s+/g, ' ').trim();
}

export function excerptHtml(html: string, maxLength = 120): string {
    const plainText = htmlToPlainText(html);

    if (plainText.length <= maxLength) {
        return plainText;
    }

    return `${plainText.slice(0, maxLength).trimEnd()}...`;
}
