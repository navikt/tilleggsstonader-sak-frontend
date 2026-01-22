export enum KlagebehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
    VENTER = 'VENTER',
    FERDIGSTILT = 'FERDIGSTILT',
}

export const behandlingStatusTilTekst: Record<KlagebehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    SATT_PÅ_VENT: 'Satt på vent',
    VENTER: 'Venter på KA',
    FERDIGSTILT: 'Ferdigstilt',
};
