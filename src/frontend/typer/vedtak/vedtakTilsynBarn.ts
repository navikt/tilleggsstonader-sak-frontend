import { TypeVedtak, ÅrsakAvslag } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

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

export type AvslåBarnetilsynRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type AvslagBarnetilsyn = AvslåBarnetilsynRequest;

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
    målgruppe: MålgruppeType;
    aktivitet: AktivitetType;
    antallBarn: number;
}

type Beregningsgrunnlag = {
    måned: string;
    utgifterTotal: number;
    antallBarn: number;
};
