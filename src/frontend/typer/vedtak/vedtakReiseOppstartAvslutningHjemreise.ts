import { Beregningsplan } from './beregningsplan';
import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';

export type VedtakReiseOppstartAvslutningHjemreise = InnvilgelseReiseOppstartAvslutningHjemreise;

export const vedtakErInnvilgelse = (
    vedtak: VedtakReiseOppstartAvslutningHjemreise
): vedtak is InnvilgelseReiseOppstartAvslutningHjemreise => vedtak.type === TypeVedtak.INNVILGELSE;

export type BeregnReiseOppstartAvslutningHjemreiseRequest = {
    vedtaksperioder: Vedtaksperiode[];
};

export interface BeregningReiseOppstartAvslutningHjemreise {
    offentligTransport?: BeregningsresultatOffentligTransport[];
    privatBil?: BeregningsresultatPrivatBil[];
    beregningsplan: Beregningsplan;
}

export interface BeregningsresultatOffentligTransport {
    reiseId: string;
    adresse?: string;
    fom: string;
    tom: string;
    beløp: number;
    aktivitetId: string;
}

export interface BeregningsresultatPrivatBil {
    reiseId: string;
    adresse?: string;
    fom: string;
    tom: string;
    sats: number;
    totaltReiseavstand: number;
    beløp: number;
    aktivitetId: string;
}

export type InnvilgeReiseOppstartAvslutningHjemreiseRequest = {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
};

export interface InnvilgelseReiseOppstartAvslutningHjemreise {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
    begrunnelse?: string;
    beregningsresultat?: BeregningReiseOppstartAvslutningHjemreise;
}
