import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { Studienivå } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitetLæremidler';
import { Periode } from '../../utils/periode';

export type VedtakLæremidler = InnvilgelseLæremidler | AvslagLæremidler;

export type InnvilgelseLæremidlerRequest = {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Periode[];
};

export interface InnvilgelseLæremidler {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Periode[];
    beregningsresultat: BeregningsresultatLæremidler;
}

export interface BeregningsresultatLæremidler {
    perioder: BeregningsresultatForPeriode[];
}

interface BeregningsresultatForPeriode {
    fom: string;
    tom: string;
    antallMåneder: number;
    studienivå: Studienivå;
    studieprosent: number;
    // beløp er sats TODO rename?
    beløp: number;
    stønadsbeløp: number;
    utbetalingsmåned: string;
}

export type AvslåLæremidlerRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagLæremidler = AvslåLæremidlerRequest;
