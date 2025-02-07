import { TypeVedtak, ÅrsakAvslag, ÅrsakOpphør } from './vedtak';
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
    type: TypeVedtak.INNVILGELSE;
};

export interface InnvilgelseBarnetilsyn {
    type: TypeVedtak.INNVILGELSE;
    beregningsresultat: BeregningsresultatTilsynBarn;
}

export type AvslåBarnetilsynRequest = {
    type: TypeVedtak.AVSLAG;
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type OpphørBarnetilsynRequest = {
    type: TypeVedtak.OPPHØR;
    årsakerOpphør: ÅrsakOpphør[];
    begrunnelse: string;
};

export type AvslagBarnetilsyn = AvslåBarnetilsynRequest;

export type OpphørBarnetilsyn = OpphørBarnetilsynRequest & {
    beregningsresultat: BeregningsresultatTilsynBarn;
};

export type BeregningsresultatTilsynBarn = {
    perioder: Beregningsresultat[];
    vedtaksperioder: Vedtaksperiode[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
};

type Beregningsresultat = {
    dagsats: number;
    månedsbeløp: number;
    grunnlag: Beregningsgrunnlag;
};

export interface Vedtaksperiode {
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
