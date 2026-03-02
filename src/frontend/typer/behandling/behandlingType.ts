export enum BehandlingType {
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
    TILBAKEKREVING = 'TILBAKEKREVING',
    KLAGE = 'KLAGE',
    KJØRELISTE = 'KJØRELISTE',
}

export const behandlingTypeTilTekst: Record<BehandlingType, string> = {
    FØRSTEGANGSBEHANDLING: 'Førstegangsbehandling',
    REVURDERING: 'Revurdering',
    TILBAKEKREVING: 'Tilbakekreving',
    KLAGE: 'Klage',
    KJØRELISTE: 'Kjøreliste',
};
