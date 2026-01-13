import { Behandling } from './behandling';

export enum Steg {
    INNGANGSVILKÅR = 'INNGANGSVILKÅR',
    VILKÅR = 'VILKÅR',
    VEDTAK = 'VEDTAK',
    KJØRELISTE = 'KJØRELISTE',
    BEREGNE_YTELSE = 'BEREGNE_YTELSE',
    BEREGN = 'BEREGN',
    SIMULERING = 'SIMULERING',
    SEND_TIL_BESLUTTER = 'SEND_TIL_BESLUTTER',
    BESLUTTE_VEDTAK = 'BESLUTTE_VEDTAK',
    JOURNALFØR_OG_DISTRIBUER_VEDTAKSBREV = 'JOURNALFØR_OG_DISTRIBUER_VEDTAKSBREV',
    FERDIGSTILLE_BEHANDLING = 'FERDIGSTILLE_BEHANDLING',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
    LAG_SAKSBEHANDLINGSBLANKETT = 'LAG_SAKSBEHANDLINGSBLANKETT',
    PUBLISER_VEDTAKSHENDELSE = 'PUBLISER_VEDTAKSHENDELSE',
}

const rekkefølgeSteg = Object.values(Steg).reduce(
    (acc, curr, indeks) => {
        acc[curr] = indeks;
        return acc;
    },
    {} as Record<Steg, number>
);

export const stegErEtterAnnetSteg = (steg: Steg, annetSteg: Steg) =>
    rekkefølgeSteg[steg] > rekkefølgeSteg[annetSteg];

export const stegErLåstForBehandling = (behandling: Behandling, faneSteg: Steg) =>
    [
        Steg.VEDTAK,
        Steg.KJØRELISTE,
        Steg.BEREGNE_YTELSE,
        Steg.SIMULERING,
        Steg.SEND_TIL_BESLUTTER,
    ].includes(faneSteg) && stegErEtterAnnetSteg(faneSteg, behandling.steg);
