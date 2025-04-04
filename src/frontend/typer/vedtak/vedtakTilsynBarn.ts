import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

export type VedtakBarnetilsyn = InnvilgelseBarnetilsyn | AvslagBarnetilsyn | OpphørBarnetilsyn;

export const vedtakErInnvilgelse = (vedtak: VedtakBarnetilsyn): vedtak is InnvilgelseBarnetilsyn =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakBarnetilsyn): vedtak is AvslagBarnetilsyn =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakBarnetilsyn): vedtak is OpphørBarnetilsyn =>
    vedtak.type === TypeVedtak.OPPHØR;

export type InnvilgeBarnetilsynRequest = {
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
};

export interface InnvilgelseBarnetilsyn {
    type: TypeVedtak.INNVILGELSE;
    beregningsresultat: BeregningsresultatTilsynBarn;
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
}

export type AvslagBarnetilsyn = AvslagRequest;

export type OpphørBarnetilsyn = OpphørRequest & {
    beregningsresultat: BeregningsresultatTilsynBarn;
    vedtaksperioder: Vedtaksperiode[];
};

export type BeregnBarnetilsynRequest = {
    vedtaksperioder: Vedtaksperiode[];
};

export type BeregningsresultatTilsynBarn = {
    perioder: Beregningsresultat[];
    vedtaksperioder: VedtaksperiodeBeregningsresultat[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
};

type Beregningsresultat = {
    dagsats: number;
    månedsbeløp: number;
    grunnlag: Beregningsgrunnlag;
};

export interface VedtaksperiodeBeregningsresultat {
    fom: string;
    tom: string;
    målgruppe: FaktiskMålgruppe;
    aktivitet: AktivitetType;
    antallBarn: number;
}

type Beregningsgrunnlag = {
    måned: string;
    utgifterTotal: number;
    antallBarn: number;
};
