import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { FaktiskMålgruppe } from '../../Sider/Behandling/Felles/faktiskMålgruppe';
import { AktivitetType } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';

export type VedtakDagligReise = InnvilgelseDagligReise | AvslagDagligReise | OpphørDagligReise;

export const vedtakErInnvilgelse = (vedtak: VedtakDagligReise): vedtak is InnvilgelseDagligReise =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakDagligReise): vedtak is AvslagDagligReise =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakDagligReise): vedtak is OpphørDagligReise =>
    vedtak.type === TypeVedtak.OPPHØR;

export type InnvilgelseDagligReiseRequest = {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    begrunnelse?: string;
};

export interface InnvilgelseDagligReise {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatDagligReise;
    gjelderFraOgMed?: string;
    gjelderTilOgMed?: string;
    begrunnelse?: string;
}

export type BeregnDagligReiseRequest = {
    vedtaksperioder: Vedtaksperiode[];
};

interface BeregningsresultatForPeriode {
    fom: string;
    tom: string;
}

export type AvslagDagligReise = AvslagRequest;

export type OpphørDagligReise = OpphørRequest & {
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatDagligReise;
};

export interface BeregningsresultatDagligReise {
    offentligTransport?: BeregningsresultatOffentligTransport;
    tidligsteEndring: string | undefined;
}

export interface BeregningsresultatOffentligTransport {
    reiser: BeregningsresultatForReise[];
}

interface BeregningsresultatForReise {
    reiseId: string;
    perioder: BeregningsresultatForPeriode[];
}

interface BeregningsresultatForPeriode {
    grunnlag: Beregningsgrunnlag;
    beløp: number;
    billettdetaljer: Record<string, number>;
}

interface Beregningsgrunnlag {
    fom: string;
    tom: string;
    prisEnkeltbillett: number;
    prisSyvdagersbillett: number;
    pris30dagersbillett: number;
    antallReisedagerPerUke: number;
    vedtaksperioder: VedtaksperiodeGrunnlag[];
    antallReisedager: number;
}

interface VedtaksperiodeGrunnlag {
    id: string;
    fom: string;
    tom: string;
    målgruppe: FaktiskMålgruppe;
    aktivitet: AktivitetType;
    antallReisedagerIVedtaksperioden: number;
}
