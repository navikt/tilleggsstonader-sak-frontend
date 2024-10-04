export enum Stønadstype {
    BARNETILSYN = 'BARNETILSYN',
    LÆREMIDLER = 'LÆREMIDLER',
}

export const stønadstypeTilTekst: Record<Stønadstype, string> = {
    BARNETILSYN: 'Tilsyn barn',
    LÆREMIDLER: 'Læremidler',
};
