export function escapeHtml(verdi: string | null | undefined): string {
    if (!verdi) return '';
    return verdi
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
