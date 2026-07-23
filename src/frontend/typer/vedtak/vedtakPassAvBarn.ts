import { Beregningsplan } from './beregningsplan';
import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

export type VedtakPassAvBarn = InnvilgelsePassAvBarn | AvslagPassAvBarn | OpphørPassAvBarn;

export const vedtakErInnvilgelse = (vedtak: VedtakPassAvBarn): vedtak is InnvilgelsePassAvBarn =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakPassAvBarn): vedtak is AvslagPassAvBarn =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakPassAvBarn): vedtak is OpphørPassAvBarn =>
    vedtak.type === TypeVedtak.OPPHØR;

export type InnvilgelsePassAvBarnRequest = {
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
};

export interface InnvilgelsePassAvBarn {
    type: TypeVedtak.INNVILGELSE;
    beregningsresultat: BeregningsresultatPassAvBarn;
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
}

export type AvslagPassAvBarn = AvslagRequest;

export type OpphørPassAvBarn = OpphørRequest & {
    vedtaksperioder: Vedtaksperiode[];
};

export type BeregnPassAvBarnRequest = {
    vedtaksperioder: Vedtaksperiode[];
};

export type BeregningsresultatPassAvBarn = {
    perioder: Beregningsresultat[];
    vedtaksperioder: VedtaksperiodeBeregningsresultat[];
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
    tidligsteEndring: string | undefined;
    beregningsplan: Beregningsplan;
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
