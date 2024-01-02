export enum Toast {
    BREV_SENDT = 'BREV_SENDT',
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
}

export const toastTilTekst: Record<Toast, string> = {
    BREV_SENDT: 'Brevet er nå sendt',
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
};
