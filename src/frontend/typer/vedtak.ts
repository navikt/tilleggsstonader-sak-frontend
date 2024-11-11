import { AktivitetType } from '../Sider/Behandling/Inngangsvilkår/typer/aktivitet';
import { MålgruppeType } from '../Sider/Behandling/Inngangsvilkår/typer/målgruppe';

export enum TypeVedtak {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    OPPHØR = 'OPPHØR',
}

export type VedtakBarnetilsyn = InnvilgelseBarnetilsyn | AvslagBarnetilsyn;

export const erVedtakInnvilgelse = (vedtak: VedtakBarnetilsyn): vedtak is InnvilgelseBarnetilsyn =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export type InnvilgeBarnetilsynRequest = {
    beregningsresultat?: BeregningsresultatTilsynBarn;
};

export interface InnvilgelseBarnetilsyn extends InnvilgeBarnetilsynRequest {
    type: TypeVedtak.INNVILGELSE;
}

export type AvslåBarnetilsynRequest = {
    årsakerAvslag: ÅrsakAvslag[];
    begrunnelse: string;
};

export type OpphørBarnetilsynRequest = {
    årsakerOpphør: ÅrsakOpphør[];
    begrunnelse: string;
};

export enum ÅrsakAvslag {
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',
    IKKE_I_MÅLGRUPPE = 'IKKE_I_MÅLGRUPPE',
    INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE = 'INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE',
    MANGELFULL_DOKUMENTASJON = 'MANGELFULL_DOKUMENTASJON',
    ANNET = 'ANNET',
}

export const årsakAvslagTilTekst: Record<ÅrsakAvslag, string> = {
    INGEN_AKTIVITET: 'Ingen aktivitet',
    IKKE_I_MÅLGRUPPE: 'Ingen målgruppe',
    INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: 'Ingen overlapp aktivitet/målgruppe',
    MANGELFULL_DOKUMENTASJON: 'Mangelfull dokumentasjon',
    ANNET: 'Annet',
};

export enum ÅrsakOpphør {
    ENDRING_AKTIVITET = 'ENDRING_AKTIVITET',
    ENDRING_MÅLGRUPPE = 'ENDRING_MÅLGRUPPE',
    ENDRING_UTGIFTER = 'ENDRING_UTGIFTER',
    ANNET = 'ANNET',
}

export const årsakOpphørTilTekst: Record<ÅrsakOpphør, string> = {
    ENDRING_AKTIVITET: 'Endring i aktivitet',
    ENDRING_MÅLGRUPPE: 'Endring i målgruppe',
    ENDRING_UTGIFTER: 'Endring i utgifter',
    ANNET: 'Annet',
};

export interface AvslagBarnetilsyn extends AvslåBarnetilsynRequest {
    type: TypeVedtak.AVSLAG;
}

export interface OpphørBarnetilsyn extends OpphørBarnetilsynRequest {
    type: TypeVedtak.OPPHØR;
}

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
