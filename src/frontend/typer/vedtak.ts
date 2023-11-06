import { BehandlingResultat } from './behandling/behandlingResultat';

export enum VedtakType {
    InnvilgelseBarnetilsyn = 'InnvilgelseBarnetilsyn',
}

export type InnvilgeVedtakForBarnetilsyn = {
    resultatType: BehandlingResultat.INNVILGET; // TODO: Sjekk om nødvendig å ta med
    stønadsperioder: Stønadsperiode[];
    utgifter: Record<string, Utgift[]>;
    _type?: VedtakType.InnvilgelseBarnetilsyn; // TODO: Sjekk om nødvendig å ta med
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
