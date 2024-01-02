import { Periode } from '../../../utils/periode';
import { Vilkår } from '../vilkår';

export interface Vilkårperioder {
    målgrupper: Målgruppe[];
    aktiviteter: Aktivitet[];
}
export interface Målgruppe extends Periode {
    type: MålgruppeType;
    vilkår: Vilkår;
}

export enum MålgruppeType {
    AAP = 'AAP',
    AAP_FERDIG_AVKLART = 'AAP_FERDIG_AVKLART',
}

export interface Aktivitet extends Periode {
    type: AktivitetType;
    vilkår: Vilkår;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
}

export interface Stønadsperiode extends Periode {
    id?: string;
    målgruppe: MålgruppeType | '';
    aktivitet: AktivitetType | '';
}
