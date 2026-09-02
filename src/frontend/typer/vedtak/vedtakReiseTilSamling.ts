import { Beregningsplan } from './beregningsplan';
import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';

export type VedtakReiseTilSamling = InnvilgelseReiseTilSamling | AvslagReiseTilSamling;

export const vedtakErInnvilgelse = (
    vedtak: VedtakReiseTilSamling
): vedtak is InnvilgelseReiseTilSamling => vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakReiseTilSamling): vedtak is AvslagReiseTilSamling =>
    vedtak.type === TypeVedtak.AVSLAG;

export type AvslagReiseTilSamling = AvslagRequest;

export type BeregnReiseTilSamlingRequest = {
    vedtaksperioder: Vedtaksperiode[];
};
export interface BeregningReiseTilSamling {
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
    aktivitetId?: string;
}
export interface BeregningsresultatPrivatBil {
    reiseId: string;
    adresse?: string;
    fom: string;
    tom: string;
    sats: number;
    totaltReiseavstand: number;
    bompenger?: number;
    fergekostnad?: number;
    parkering?: number;
    beløp: number;
}
export type InnvilgeReiseTilSamlingRequest = {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
};
export interface InnvilgelseReiseTilSamling {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
    begrunnelse?: string;
    beregningsresultat?: BeregningReiseTilSamling;
}
