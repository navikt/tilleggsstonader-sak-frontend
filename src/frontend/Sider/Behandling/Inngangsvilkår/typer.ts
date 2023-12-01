import { Vilkår } from '../vilkår';

export interface Målgruppe {
    id: string;
    fom: string;
    tom: string;
    type: MålgruppeType;
    vilkår: Vilkår;
}

export enum MålgruppeType {
    AAP = 'AAP',
    AAP_FERDIG_AVKLART = 'AAP_FERDIG_AVKLART',
}

export interface Aktivitet {
    id: string;
    fom: string;
    tom: string;
    type: AktivitetType;
    vilkår: Vilkår;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
}

export type Stønadsperiode = {
    målgruppe: MålgruppeType | '';
    aktivitet: AktivitetType | '';
    fom: string;
    tom: string;
};
