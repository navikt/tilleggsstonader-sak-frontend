import { TypeVedtak, ÅrsakAvslag } from './vedtak';

export interface BeregningsresultatLæremidler {
    perioder: BeregningsresultatForPeriode[];
}

interface BeregningsresultatForPeriode {
    fom: string;
    tom: string;
    antallMåneder: number;
    studienivå: Studienivå;
    studieprosent: number;
    sats: number;
    stønadsbeløp: number;
    utbetalingsmåned: string;
}

export type AvslåLæremidlerRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagLæremidler = AvslåLæremidlerRequest;
