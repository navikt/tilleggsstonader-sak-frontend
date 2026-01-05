export enum Stønadstype {
    BARNETILSYN = 'BARNETILSYN',
    LÆREMIDLER = 'LÆREMIDLER',
    BOUTGIFTER = 'BOUTGIFTER',
    DAGLIG_REISE_TSO = 'DAGLIG_REISE_TSO',
    DAGLIG_REISE_TSR = 'DAGLIG_REISE_TSR',
}

export const stønadstypeTilTekst: Record<Stønadstype, string> = {
    BARNETILSYN: 'Tilsyn barn',
    LÆREMIDLER: 'Læremidler',
    BOUTGIFTER: 'Bolig/overnatting',
    DAGLIG_REISE_TSO: 'Daglig reise (Nay)',
    DAGLIG_REISE_TSR: 'Daglig reise (Tiltaksenheten)',
};

export const stønadstypeTilTekstUtenBehandlendeEnhet: Record<Stønadstype, string> = {
    ...stønadstypeTilTekst,
    DAGLIG_REISE_TSO: 'Daglig reise',
    DAGLIG_REISE_TSR: 'Daglig reise',
};

export const stønadstypeTilEnhet: Record<Stønadstype, string> = {
    BARNETILSYN: 'Nay',
    LÆREMIDLER: 'Nay',
    BOUTGIFTER: 'Nay',
    DAGLIG_REISE_TSO: 'Nay',
    DAGLIG_REISE_TSR: 'Tiltaksenheten',
};
