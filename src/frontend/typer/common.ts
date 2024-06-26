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
