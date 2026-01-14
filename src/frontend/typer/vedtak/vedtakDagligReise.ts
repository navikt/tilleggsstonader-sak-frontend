import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { BillettType } from '../behandling/behandlingFakta/faktaReise';

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

export type AvslagDagligReise = AvslagRequest;

export type OpphørDagligReise = OpphørRequest & {
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatDagligReise;
};

export interface BeregningsresultatDagligReise {
    offentligTransport?: BeregningsresultatOffentligTransport;
    privatBil?: BeregningsresultatPrivatBil;
    tidligsteEndring: string | undefined;
}

export interface BeregningsresultatOffentligTransport {
    reiser: BeregningsresultatForReise[];
}

export type Billettdetaljer = {
    [BillettType.ENKELTBILLETT]?: number;
    [BillettType.SYVDAGERSBILLETT]?: number;
    [BillettType.TRETTIDAGERSBILLETT]?: number;
};

interface BeregningsresultatForReise {
    reiseId: string;
    perioder: BeregningsresultatForPeriode[];
}

export interface BeregningsresultatForPeriode {
    fom: string;
    tom: string;
    prisEnkeltbillett?: number;
    prisSyvdagersbillett?: number;
    pris30dagersbillett?: number;
    antallReisedagerPerUke: number;
    beløp: number;
    billettdetaljer: Billettdetaljer;
    antallReisedager: number;
    fraTidligereVedtak: boolean;
}

export interface BeregningsresultatPrivatBil {
    reiser: BeregningsresultatForReiseMedPrivatBil[];
}

interface BeregningsresultatForReiseMedPrivatBil {
    uker: BeregningsresultatForUke[];
    grunnlag: BeregningsgrunnlagForReiseMedPrivatBil;
}

interface BeregningsresultatForUke {
    grunnlag: BeregningsgrunnlagForUke;
    stønadsbeløp: number;
}

interface BeregningsgrunnlagForUke {
    fom: string; // mandag eller begrenset av reiseperioden
    tom: string; // søndag eller fredag?
    //kjøreliste?: GrunnlagKjøreliste,
    antallDagerDenneUkaSomKanDekkes: number;
    antallDagerInkludererHelg: boolean;
}

interface BeregningsgrunnlagForReiseMedPrivatBil {
    fom: string;
    tom: string;
    reisedagerPerUke: number;
    reiseavstandEnVei: number;
    kilometersats: number;
    ekstrakostnader: Ekstrakostnader;
}

interface Ekstrakostnader {
    bompengerEnVei?: number;
    fergekostnadEnVei?: number;
}
