import { TypeVedtak } from './vedtak';
import { Vedtaksperiode } from './vedtakperiode';
import { AvslagRequest } from '../../hooks/useLagreAvslag';
import { OpphørRequest } from '../../hooks/useLagreOpphør';
import { VedtaksperiodeUtenAktivitetDto } from '../../Sider/Behandling/VedtakOgBeregning/Felles/vedtaksperioder/vedtaksperiodeUtils';

export type VedtakFlytting = InnvilgelseFlytting | AvslagFlytting | OpphørFlytting;

export type AvslagFlytting = AvslagRequest;

export type OpphørFlytting = OpphørRequest & {
    vedtaksperioder?: Vedtaksperiode[];
};

export const vedtakErInnvilgelse = (vedtak: VedtakFlytting): vedtak is InnvilgelseFlytting =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export const vedtakErAvslag = (vedtak: VedtakFlytting): vedtak is AvslagFlytting =>
    vedtak.type === TypeVedtak.AVSLAG;

export const vedtakErOpphør = (vedtak: VedtakFlytting): vedtak is OpphørFlytting =>
    vedtak.type === TypeVedtak.OPPHØR;

export interface InnvilgelseFlytting {
    type: TypeVedtak.INNVILGELSE;
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat: BeregningsresultatFlytting;
    begrunnelse?: string;
    gjelderFraOgMed: string;
    gjelderTilOgMed: string;
}

export interface InnvilgelseFlyttingRequest {
    vedtaksperioder: Vedtaksperiode[] | VedtaksperiodeUtenAktivitetDto[];
    begrunnelse?: string;
}

export interface BeregningsresultatFlytting {
    resultater: BeregningsresultatFlyttevilkår[];
}

export type BeregningsresultatFlyttevilkår = {
    fraTidligereVedtak: boolean;
    fom: string;
    tom: string;
    beløp: number;
    grunnlag: BeregningsgrunnlagFlyttebyrå | BeregningsgrunnlagFlytteSelv;
};

export enum BeregningsgrunnlagType {
    FLYTTEBYRÅ = 'FLYTTEBYRÅ',
    FLYTTE_SELV = 'FLYTTE_SELV',
}

export type BeregningsgrunnlagFlyttebyrå = {
    type: BeregningsgrunnlagType.FLYTTEBYRÅ;
    tilbud: BeregningsgrunnlagFlyttebyråTilbud[];
    erBetalingDokumentert: boolean;
};

export interface BeregningsgrunnlagFlyttebyråTilbud {
    navn: string;
    pris: number;
    erValgt: boolean;
}

export function hentValgtFlyttebyråTilbud(
    grunnlag: BeregningsgrunnlagFlyttebyrå
): BeregningsgrunnlagFlyttebyråTilbud {
    const valgteTilbud = grunnlag.tilbud.filter((tilbud) => tilbud.erValgt);
    if (valgteTilbud.length !== 1) {
        throw new Error('Forventer nøyaktig ett valgt flyttebyråtilbud');
    }
    return valgteTilbud[0];
}

export type BeregningsgrunnlagFlytteSelv = {
    type: BeregningsgrunnlagType.FLYTTE_SELV;
    avstandEnVei: number;
    sats: number;
    satsBekreftet: boolean;
    henger: number;
    bompenger: number;
    ferge: number;
    parkering: number;
};
