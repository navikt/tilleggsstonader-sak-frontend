import { Beregningsplan } from './beregningsplan';
import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { VedtaksperiodeTsrDto } from '../../Sider/Behandling/VedtakOgBeregning/DagligReise/innvilgeVedtak/innvilgeDagligReiseUtils';
import { VedtaksperiodeTso } from '../../Sider/Behandling/VedtakOgBeregning/Felles/vedtaksperioder/vedtaksperiodeDtoUtil';
import { Periode } from '../../utils/periode';
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
    vedtaksperioder: VedtaksperiodeTso[] | VedtaksperiodeTsrDto[];
    begrunnelse?: string;
};

export interface InnvilgelseDagligReise {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatDagligReise;
    rammevedtakPrivatBil?: RammevedtakPrivatBil;
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
};

export interface BeregningDagligReise {
    beregningsresultat: BeregningsresultatDagligReise;
    rammevedtakPrivatBil?: RammevedtakPrivatBil;
}

export interface BeregningsresultatDagligReise {
    offentligTransport?: BeregningsresultatOffentligTransport;
    privatBil?: BeregningsresultatPrivatBil;
    tidligsteEndring?: string;
    beregningsplan: Beregningsplan;
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
    adresse?: string;
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

export interface RammevedtakPrivatBil {
    reiser: RammeForReiseMedPrivatBil[];
}

export interface RammeForReiseMedPrivatBil {
    reiseId: string;
    aktivitetsadresse: string;
    fom: string;
    tom: string;
    delperioder: RammeForReiseMedPrivatBilDelperiode[];
    reiseavstandEnVei: number;
}

export interface RammeForReiseMedPrivatBilDelperiode extends Periode {
    fom: string;
    tom: string;
    reisedagerPerUke: number;
    satser: RammeForReiseMedPrivatBilSatsForDelperiode[];
    bompengerPerDag?: number;
    fergekostnadPerDag?: number;
}

export interface RammeForReiseMedPrivatBilSatsForDelperiode {
    fom: string;
    tom: string;
    kilometersats: number;
    dagsatsUtenParkering: number;
    satsBekreftetVedVedtakstidspunkt: boolean;
}

export interface RammeForUke {
    fom: string;
    tom: string;
    maksAntallDagerSomKanDekkes: number;
    antallDagerInkludererHelg: boolean;
    maksBeløpSomKanDekkesFørParkering: number;
}

export interface BeregningsresultatPrivatBil {
    reiser: BeregningsresultatForReisePrivatBil[];
}

export interface BeregningsresultatForReisePrivatBil {
    reiseId: string;
    adresse?: string;
    reisedagerPerUke?: number;
    perioder: BeregningsresultatForPeriodePrivatBil[];
}

export interface BeregningsresultatForPeriodePrivatBil {
    fom: string;
    tom: string;
    grunnlag: BeregningsresultatPrivatBilGrunnlag;
    stønadsbeløp: number;
    brukersNavKontor?: string;
}

export interface BeregningsresultatPrivatBilGrunnlag {
    dager: BeregningsresultatPrivatBilDag[];
    dagsatsUtenParkering: number;
}

export interface BeregningsresultatPrivatBilDag {
    dato: string;
    parkeringskostnad: number;
    stønadsbeløpForDag: number;
}
