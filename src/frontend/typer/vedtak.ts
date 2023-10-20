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
    fom: string;
    tom: string;
};

export enum StønadsperiodeProperty {
    FOM = 'fom',
    TOM = 'tom',
}

export type Utgift = {
    fom: string;
    tom: string;
    utgift?: number;
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
