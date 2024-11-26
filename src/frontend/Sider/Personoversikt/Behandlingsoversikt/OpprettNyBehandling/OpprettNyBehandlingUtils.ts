export enum OpprettNyBehandlingType {
    ORDINAER_BEHANDLING = 'ORDINAER_BEHANDLING',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export const opprettNyBehandlingTypeTilTekst: Record<OpprettNyBehandlingType, string> = {
    ORDINAER_BEHANDLING: 'Ordinær behandling',
    KLAGE: 'Klage',
    TILBAKEKREVING: 'Tilbakekreving',
};
