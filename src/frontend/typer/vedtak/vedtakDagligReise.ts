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
    beregningsresultat: BeregningsresultatDagligReise;
};

export interface BeregningsresultatDagligReise {
    offentligTransport?: BeregningsresultatOffentligTransport;
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
    reisedagerPerUke: number;
    reiseavstandEnVei: number;
    bompengerEnVei?: number;
    fergekostnadEnVei?: number;
    kilometersats: number;
    dagsatsUtenParkering: number;
    uker: RammeForUke[];
}

export interface RammeForUke {
    fom: string;
    tom: string;
    maksAntallDagerSomKanDekkes: number;
    antallDagerInkludererHelg: boolean;
    maksBeløpSomKanDekkesFørParkering: number;
}
