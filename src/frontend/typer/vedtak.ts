import { BehandlingResultat } from './behandling/behandlingResultat';

export enum VedtakType {
    InnvilgelseBarnetilsyn = 'InnvilgelseBarnetilsyn',
}

export type InnvilgeVedtakForBarnetilsyn = {
    resultatType: BehandlingResultat.INNVILGET;
    stønadsperioder: Stønadsperiode[];
    utgifter: Record<string, Utgift[]>;
    _type?: VedtakType.InnvilgelseBarnetilsyn;
};

export type Stønadsperiode = {
    fra: string;
    til: string;
};

export enum StønadsperiodeProperty {
    FRA = 'fra',
    TIL = 'til',
}

export type Utgift = {
    fra: string;
    til: string;
    utgift?: number;
};

export enum UtgifterProperty {
    fra = 'fra',
    til = 'til',
    utgift = 'utgift',
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
