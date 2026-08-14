export interface UkeTilInnsending {
    ukenummer: number;
    ukeIÅr: string;
    fom: string;
    tom: string;
    skalSendesInn: boolean;
    innsendtTidligere: boolean;
    dager: DagTilInnsending[];
}

export interface DagTilInnsending {
    dato: string;
    harKjørt: boolean;
    parkeringsutgift?: number;
}
