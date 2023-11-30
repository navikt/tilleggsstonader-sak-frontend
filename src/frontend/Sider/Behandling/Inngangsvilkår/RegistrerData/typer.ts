export type RegistrerDataForm = {
    målgruppePerioder: MålgruppePeriode[];
};

export type MålgruppePeriode = {
    type: MålgruppeType;
    fom: string;
    tom: string;
};

export enum MålgruppeType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
    ARBEIDSSØKER = 'ARBEIDSSØKER',
}
