import { BehandlingResultat } from './behandling/behandlingResultat';

export enum VedtakType {
    InnvilgelseBarnetilsyn = 'InnvilgelseBarnetilsyn',
}

export type InnvilgeVedtakForBarnetilsyn = {
    resultatType: BehandlingResultat.INNVILGET;
    begrunnelse?: string;
    stønadsperioder: Stønadsperiode[];
    utgifter: Record<string, Utgift[]>;
    perioder: Utgiftsperiode[];
    // perioderKontantstøtte: IPeriodeMedBeløp[];
    // tilleggsstønad: ITilleggsstønad;
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

export type Utgiftsperiode = {
    periodetype: Utgiftsperiodetype | undefined;
    fra: string;
    til: string;
    barn: string[];
    aktivitetstype: UtgiftsperiodeAktivitet | undefined;
    antallAktivitetsdager: number | undefined;
    utgifter: number | undefined;
    dagerMedTilsyn: number | undefined;
};

export enum UtgiftsperiodeProperty {
    periodetype = 'periodetype',
    fra = 'fra',
    til = 'til',
    barn = 'barn',
    aktivitetstype = 'aktivitetstype',
    antallAktivitetsdager = 'antallAktivitetsdager',
    utgifter = 'utgifter',
    dagerMedTilsyn = 'dagerMedTilsyn',
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
