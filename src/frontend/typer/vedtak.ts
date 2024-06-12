import { AktivitetType } from '../Sider/Behandling/Inngangsvilkår/typer/aktivitet';

export enum TypeVedtak {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
}

export const typeVedtakTilTekst: Record<TypeVedtak, string> = {
    INNVILGELSE: 'Innvilgelse',
    AVSLAG: 'Avslag',
};

/**
 * Mapper fra type vedtak til typen malen er definert som i Sanity.
 */
export const typeVedtakTilSanitytype = (type: TypeVedtak): string => {
    switch (type) {
        case TypeVedtak.INNVILGELSE:
            return 'INNVILGET';
        default:
            return type;
    }
};

export type VedtakBarnetilsyn = InnvilgelseBarnetilsyn | AvslagBarnetilsyn;

export const erVedtakInnvilgelse = (vedtak: VedtakBarnetilsyn): vedtak is InnvilgelseBarnetilsyn =>
    vedtak.type === TypeVedtak.INNVILGELSE;

export type InnvilgeBarnetilsynRequest = {
    utgifter: Record<string, Utgift[]>;
    beregningsresultat?: BeregningsresultatTilsynBarn;
};

export interface InnvilgelseBarnetilsyn extends InnvilgeBarnetilsynRequest {
    type: TypeVedtak.INNVILGELSE;
}

export type AvslåBarnetilsynRequest = {
    årsakerAvslag: ÅrsakAvslag[];
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

export interface AvslagBarnetilsyn extends AvslåBarnetilsynRequest {
    type: TypeVedtak.AVSLAG;
}

export type StønadsperiodeGrunnlag = {
    stønadsperiode: Stønadsperiode;
    aktiviteter: Aktivitet[];
    antallDager: number;
};

type Aktivitet = {
    type: AktivitetType;
    fom: string;
    tom: string;
    aktivitetsdager: number;
};

export type Stønadsperiode = {
    fom: string;
    tom: string;
    endretKey?: string; // intern for re-rendring
};

export enum StønadsperiodeProperty {
    FOM = 'fom',
    TOM = 'tom',
}

export type Utgift = {
    fom: string;
    tom: string;
    utgift?: number;
    endretKey?: string; // intern for re-rendring
};

export enum UtgifterProperty {
    FOM = 'fom',
    TOM = 'tom',
    UTGIFT = 'utgift',
}

export type BeregningsresultatTilsynBarn = {
    perioder: Beregningsresultat[];
};

type Beregningsresultat = {
    dagsats: number;
    månedsbeløp: number;
    grunnlag: Beregningsgrunnlag;
};

type Beregningsgrunnlag = {
    måned: string;
    makssats: number;
    stønadsperioderGrunnlag: StønadsperiodeGrunnlag[];
    utgifter: UtgiftBarn[];
    antallDagerTotal: number;
    utgifterTotal: number;
    antallBarn: number;
};

type UtgiftBarn = {
    barnId: string;
    utgift: number;
};
