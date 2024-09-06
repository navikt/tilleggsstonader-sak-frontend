export enum KlagebehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    VENTER = 'VENTER',
    FERDIGSTILT = 'FERDIGSTILT',
}

export const behandlingStatusTilTekst: Record<KlagebehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    VENTER: 'Venter',
    FERDIGSTILT: 'Ferdigstilt',
};
