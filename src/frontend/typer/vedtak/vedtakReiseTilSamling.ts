import { Beregningsplan } from './beregningsplan';
import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { OpphørRequest } from '../../hooks/useLagreOpphør';

export type VedtakReiseTilSamling =
    InnvilgelseReiseTilSamling | AvslagReiseTilSamling | OpphørReiseTilSamling;

export const vedtakErInnvilgelse = (
    vedtak: VedtakReiseTilSamling
): vedtak is InnvilgelseReiseTilSamling => vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakReiseTilSamling): vedtak is AvslagReiseTilSamling =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakReiseTilSamling): vedtak is OpphørReiseTilSamling =>
    vedtak.type === TypeVedtak.OPPHØR;

export type AvslagReiseTilSamling = AvslagRequest;

export type OpphørReiseTilSamling = OpphørRequest & {
    vedtaksperioder: Vedtaksperiode[];
};

export type BeregnReiseTilSamlingRequest = {
    vedtaksperioder: Vedtaksperiode[];
};
export interface BeregningResultatReiseTilSamling {
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
    fraTidligereVedtak: boolean;
}
export interface BeregningsresultatPrivatBil {
    reiseId: string;
    adresse?: string;
    fom: string;
    tom: string;
    sats: number;
    totalReiseavstand: number;
    bompenger?: number;
    fergekostnad?: number;
    parkering?: number;
    piggdekkavgift?: number;
    beløp: number;
    fraTidligereVedtak: boolean;
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
    beregningsresultat?: BeregningResultatReiseTilSamling;
}
