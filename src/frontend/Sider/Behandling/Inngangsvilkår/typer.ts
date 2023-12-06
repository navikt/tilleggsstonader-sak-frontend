import { Periode } from '../../../utils/dato';
import { Vilkår } from '../vilkår';

export interface Målgruppe extends Periode {
    id: string;
    type: MålgruppeType;
    vilkår: Vilkår;
}

export enum MålgruppeType {
    AAP = 'AAP',
    AAP_FERDIG_AVKLART = 'AAP_FERDIG_AVKLART',
}

export interface Aktivitet extends Periode {
    id: string;
    type: AktivitetType;
    vilkår: Vilkår;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
}

export interface Stønadsperiode extends Periode {
    målgruppe: MålgruppeType | '';
    aktivitet: AktivitetType | '';
    fom: string;
    tom: string;
}
