export enum TypeVedtak {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
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
};

export type Stønadsperiode = {
    fom: string;
    tom: string;
    endretKey?: string; // intern for re-rendring
};

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
    stønadsperioderGrunnlag: StønadsperiodeGrunnlag[];
    utgifterTotal: number;
    antallBarn: number;
};
