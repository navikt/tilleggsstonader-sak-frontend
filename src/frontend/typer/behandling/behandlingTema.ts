export enum Stønadstype {
    BARNETILSYN = 'BARNETILSYN',
    LÆREMIDLER = 'LÆREMIDLER',
    BOUTGIFTER = 'BOUTGIFTER',
    DAGLIG_REISE_TSO = 'DAGLIG_REISE_TSO',
    DAGLIG_REISE_TSR = 'DAGLIG_REISE_TSR',
    REISE_TIL_SAMLING_TSO = 'REISE_TIL_SAMLING_TSO',
}

export const stønadstypeTilTekst: Record<Stønadstype, string> = {
    BARNETILSYN: 'Tilsyn barn',
    LÆREMIDLER: 'Læremidler',
    BOUTGIFTER: 'Bolig/overnatting',
    DAGLIG_REISE_TSO: 'Daglige reiser (Nay)',
    DAGLIG_REISE_TSR: 'Daglige reiser (Tiltaksenheten)',
    REISE_TIL_SAMLING_TSO: 'Reise til samling (Nay)',
};

export const stønadstypeTilTekstUtenBehandlendeEnhet: Record<Stønadstype, string> = {
    ...stønadstypeTilTekst,
    DAGLIG_REISE_TSO: 'Daglige reiser',
    DAGLIG_REISE_TSR: 'Daglige reiser',
};
