import { Beregningsplan } from './beregningsplan';
import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';

export type VedtakReiseTilSamling = InnvilgelseReiseTilSamling;

export const vedtakErInnvilgelse = (
    vedtak: VedtakReiseTilSamling
): vedtak is InnvilgelseReiseTilSamling => vedtak.type === TypeVedtak.INNVILGELSE;

export interface InnvilgelseReiseTilSamling {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatReiseTilSamling;
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
    begrunnelse?: string;
}

export interface BeregningsresultatReiseTilSamling {
    offentligTransport?: BeregningsresultatOffentligTransport;
    tidligsteEndring?: string;
    beregningsplan: Beregningsplan;
}

export interface BeregningsresultatOffentligTransport {
    reiser: BeregningsresultatForReise[];
}

interface BeregningsresultatForReise {
    reiseId: string;
    adresse?: string;
    perioder: BeregningsresultatForPeriode[];
}

export interface BeregningsresultatForPeriode {
    fom: string;
    tom: string;
    beløp: number;
    fraTidligereVedtak: boolean;
}
