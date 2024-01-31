export enum Toast {
    BREV_SENDT = 'BREV_SENDT',
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    DISABLED_FANE = 'DISABLED_FANE',
}

export const toastTilTekst: Record<Toast, string> = {
    BREV_SENDT: 'Brevet er nå sendt',
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    DISABLED_FANE: 'Du kan ikke navigere til dette steget enda',
};
