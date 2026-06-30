import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';

export type VedtakReiseTilSamling = InnvilgelseReiseTilSamling;

export const vedtakErInnvilgelse = (
    vedtak: VedtakReiseTilSamling
): vedtak is InnvilgelseReiseTilSamling => vedtak.type === TypeVedtak.INNVILGELSE;

export type BeregnReiseTilSamlingRequest = {
    vedtaksperioder: Vedtaksperiode[];
};
export interface BeregningReiseTilSamling {
    offentligTransport?: BeregningsresultatOffentligTransport;
}
export interface BeregningsresultatOffentligTransport {
    samling: BeregningsResultatForSamling[];
}
export interface BeregningsResultatForSamling {
    reiseId: string;
    adresse?: string;
    fom: string;
    tom: string;
    utgifterOffentligTransport?: number;
}

export type InnvilgeReiseTilSamlingRequest = {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse: string;
};
export interface InnvilgelseReiseTilSamling {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
    begrunnelse?: string;
    beregningsresultat?: BeregningsresultatForSamling[];
}
export type BeregningsresultatForSamling = Record<string, unknown>;
