export interface Kjøreliste {
    reiseId: string;
    uker: KjørelisteUke[];
}

export interface KjørelisteUke {
    ukeNummer: number;
    reisedager: KjørelisteDag[];
}

export interface KjørelisteDag {
    dato: string;
    harKjørt: boolean;
    parkeringsutgift?: number;
}
