export enum Stønadstype {
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    SKOLEPENGER = 'SKOLEPENGER',
    BARNETILSYN = 'BARNETILSYN',
    BARNETRYGD = 'BARNETRYGD',
    KONTANTSTØTTE = 'KONTANTSTØTTE',
}

export const stønadstypeTilTekst: Record<Stønadstype, string> = {
    OVERGANGSSTØNAD: 'Overgangsstønad',
    SKOLEPENGER: 'Skolepenger',
    BARNETILSYN: 'Barnetilsyn',
    BARNETRYGD: 'Barnetrygd',
    KONTANTSTØTTE: 'Kontantstøtte',
};

export const stønadstypeTilTekstKort: Record<Stønadstype, string> = {
    OVERGANGSSTØNAD: 'OS',
    SKOLEPENGER: 'SP',
    BARNETILSYN: 'BT',
    BARNETRYGD: 'BA',
    KONTANTSTØTTE: 'KS',
};
