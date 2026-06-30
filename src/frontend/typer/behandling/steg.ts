import { Behandling } from './behandling';

export enum Steg {
    INNGANGSVILKÅR = 'INNGANGSVILKÅR',
    VILKÅR = 'VILKÅR',
    BEREGNE_YTELSE = 'BEREGNE_YTELSE',
    REGISTRER_KJØRELISTE = 'REGISTRER_KJØRELISTE',
    KJØRELISTE = 'KJØRELISTE',
    BEREGNING = 'BEREGNING',
    SIMULERING = 'SIMULERING',
    FULLFØR_KJØRELISTE = 'FULLFØR_KJØRELISTE',
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
        Steg.REGISTRER_KJØRELISTE,
        Steg.KJØRELISTE,
        Steg.BEREGNE_YTELSE,
        Steg.SIMULERING,
        Steg.SEND_TIL_BESLUTTER,
        Steg.BEREGNING,
        Steg.FULLFØR_KJØRELISTE,
    ].includes(faneSteg) && stegErEtterAnnetSteg(faneSteg, behandling.steg);
