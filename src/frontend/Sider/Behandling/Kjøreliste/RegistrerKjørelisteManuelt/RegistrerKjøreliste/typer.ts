export interface UkeTilInnsending {
    ukenummer: number;
    fom: string;
    tom: string;
    skalSendesInn: boolean;
    innsendtTidligere: boolean;
    // undefined når uken allerede er innsendt av bruker (og dermed låst/ikke redigerbar)
    dager: DagTilInnsending[] | undefined;
}

export interface DagTilInnsending {
    dato: string;
    harKjørt: boolean;
    parkeringsutgift?: number;
}
