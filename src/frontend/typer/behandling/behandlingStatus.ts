export enum BehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    FATTER_VEDTAK = 'FATTER_VEDTAK',
    IVERKSETTER_VEDTAK = 'IVERKSETTER_VEDTAK',
    FERDIGSTILT = 'FERDIGSTILT',
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
}

export const behandlingStatusTilTekst: Record<BehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    FATTER_VEDTAK: 'Fatter vedtak',
    IVERKSETTER_VEDTAK: 'Iverksetter vedtak',
    FERDIGSTILT: 'Ferdigstilt',
    SATT_PÅ_VENT: 'Satt på vent',
};

export const erBehandlingRedigerbar = (status: BehandlingStatus): boolean =>
    [BehandlingStatus.OPPRETTET, BehandlingStatus.UTREDES].includes(status);
