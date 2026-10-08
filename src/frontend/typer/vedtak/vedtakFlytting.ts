import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { VedtaksperiodeTsrDto } from '../../Sider/Behandling/VedtakOgBeregning/Felles/vedtaksperioder/vedtaksperiodeUtils';

export type VedtakFlytting = InnvilgelseFlytting | AvslagFlytting;

export type AvslagFlytting = AvslagRequest;

export const vedtakErInnvilgelse = (vedtak: VedtakFlytting): vedtak is InnvilgelseFlytting =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakFlytting): vedtak is AvslagFlytting =>
    vedtak.type === TypeVedtak.AVSLAG;

export interface InnvilgelseFlytting {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatFlytting;
    begrunnelse?: string;
    gjelderFraOgMed: string;
    gjelderTilOgMed: string;
}

export interface InnvilgelseFlyttingRequest {
    vedtaksperioder: Vedtaksperiode[] | VedtaksperiodeTsrDto[];
    begrunnelse?: string;
}

export interface BeregningsresultatFlytting {
    resultater: BeregningsresultatFlyttevilkår[];
}

export type BeregningsresultatFlyttevilkår = {
    fom: string;
    tom: string;
    beløp: number;
    grunnlag: BeregningsGrunnlagFlyttebyrå | BeregningsGrunnlagFlytteSelv;
};

export enum BeregningsGunnlagType {
    FLYTTEBYRÅ = 'FLYTTEBYRÅ',
    FLYTTE_SELV = 'FLYTTE_SELV',
}

export type BeregningsGrunnlagFlyttebyrå = {
    type: BeregningsGunnlagType.FLYTTEBYRÅ;
    tilbud1Pris: number;
    tilbud2Pris: number;
    erBetalingDokumentert: boolean;
};

export type BeregningsGrunnlagFlytteSelv = {
    type: BeregningsGunnlagType.FLYTTE_SELV;
    avstandEnVei: number;
    sats: number;
    satsBekreftet: boolean;
    henger: number;
    bompenger: number;
    ferge: number;
    parkering: number;
};
