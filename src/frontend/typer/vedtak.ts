export enum TypeVedtak {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
}

export const typeVedtakTilTekst: Record<TypeVedtak, string> = {
    INNVILGELSE: 'Innvilgelse',
    AVSLAG: 'Avslag',
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
    begrunnelse: string;
};

export interface AvslagBarnetilsyn extends AvslåBarnetilsynRequest {
    type: TypeVedtak.AVSLAG;
}

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

export enum Utgiftsperiodetype {
    ORDINÆR = 'ORDINÆR',
}

export const utgiftsperiodetypeTilTekst: Record<Utgiftsperiodetype, string> = {
    ORDINÆR: 'Ordinær',
};

export enum UtgiftsperiodeAktivitet {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
}

export const utgiftsperiodeAktivitetTilTekst: Record<UtgiftsperiodeAktivitet, string> = {
    TILTAK: 'Tiltak',
    UTDANNING: 'Utdanning',
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
    makssats: number;
    stønadsperioder: Stønadsperiode[];
    utgifter: UtgiftBarn[];
    antallDagerTotal: number;
    utgifterTotal: number;
    antallBarn: number;
};

type UtgiftBarn = {
    barnId: string;
    utgift: number;
};
