export function formaterAntallOgPris(antall: number | undefined, pris: number | undefined): string {
    if (!antall) {
        return '-';
    }
    return `${antall} x ${pris} kr`;
}
