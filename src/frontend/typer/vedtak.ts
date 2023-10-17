import { BehandlingResultat } from './behandling/behandlingResultat';

export enum VedtakType {
    InnvilgelseBarnetilsyn = 'InnvilgelseBarnetilsyn',
}

export type InnvilgeVedtakForBarnetilsyn = {
    resultatType: BehandlingResultat.INNVILGET;
    begrunnelse?: string;
    stønadsperioder: Stønadsperiode[];
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
