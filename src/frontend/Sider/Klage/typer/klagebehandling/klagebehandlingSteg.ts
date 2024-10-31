export enum KlagebehandlingSteg {
    OPPRETTET = 'OPPRETTET',
    FORMKRAV = 'FORMKRAV',
    VURDERING = 'VURDERING',
    BREV = 'BREV',
    OVERFØRING_TIL_KABAL = 'OVERFØRING_TIL_KABAL',
    KABAL_VENTER_SVAR = 'KABAL_VENTER_SVAR',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
}

export const stegrekkefølge: Record<KlagebehandlingSteg, number> = {
    OPPRETTET: 0,
    FORMKRAV: 1,
    VURDERING: 2,
    BREV: 3,
    OVERFØRING_TIL_KABAL: 4,
    KABAL_VENTER_SVAR: 4,
    BEHANDLING_FERDIGSTILT: 4,
};

export const behandlingStegTilTekst: Record<KlagebehandlingSteg, string> = {
    OPPRETTET: 'Opprettet',
    FORMKRAV: 'Formkrav',
    VURDERING: 'Vurdering',
    BREV: 'Brev',
    OVERFØRING_TIL_KABAL: 'Overført til Nav klageinstans',
    KABAL_VENTER_SVAR: 'Venter på svar fra Nav klageinstans',
    BEHANDLING_FERDIGSTILT: 'Fullført',
};

export const behandlingStegFullførtTilTekst: Record<KlagebehandlingSteg, string> = {
    OPPRETTET: 'Behandling er opprettet',
    FORMKRAV: 'Formkrav er oppdatert',
    VURDERING: 'Vurdering er oppdatert',
    BREV: 'Brev er oppdatert',
    OVERFØRING_TIL_KABAL: 'Overført til Nav klageinstans',
    KABAL_VENTER_SVAR: 'Mottatt svar fra Nav klageinstans',
    BEHANDLING_FERDIGSTILT: 'Klagen er ferdigstilt',
};
