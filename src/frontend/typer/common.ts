// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export enum JaNei {
    JA = 'JA',
    NEI = 'NEI',
}

export const jaNeiTilTekst: Record<JaNei, string> = {
    JA: 'Ja',
    NEI: 'Nei',
};

export enum JaNeiSitterPåMedAndre {
    JA = 'JA',
    NEI = 'NEI',
    SITTER_PÅ_MED_ANDRE = 'SITTER_PÅ_MED_ANDRE',
}

export const jaNeiSitterPåMedandreTilTekst: Record<JaNeiSitterPåMedAndre, string> = {
    JA: 'Ja',
    NEI: 'Nei',
    SITTER_PÅ_MED_ANDRE: 'Nei, men jeg sitter på med andre',
};
