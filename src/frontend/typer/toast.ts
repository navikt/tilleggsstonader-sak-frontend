export enum Toast {
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    DISABLED_FANE = 'DISABLED_FANE',
    BEHANDLING_HENLAGT = 'BEHANDLING_HENLAGT',
    OPPDATERT_GRUNNLAG_VILKÅRPERIODE = 'OPPDATERT_GRUNNLAG_VILKÅRPERIODE',
}

export const toastTilTekst: Record<Toast, string> = {
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    DISABLED_FANE: 'Du kan ikke navigere til dette steget enda',
    BEHANDLING_HENLAGT: 'Behandlingen er henlagt',
    OPPDATERT_GRUNNLAG_VILKÅRPERIODE: 'Har oppdatert grunnlag til vilkårperioder',
};
