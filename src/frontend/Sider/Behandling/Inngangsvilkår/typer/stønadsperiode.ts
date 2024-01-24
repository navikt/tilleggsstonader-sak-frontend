import { AktivitetType } from './aktivitet';
import { MålgruppeType } from './målgruppe';
import { Periode } from '../../../../utils/periode';

export interface Stønadsperiode extends Periode {
    id?: string;
    målgruppe: MålgruppeType | '';
    aktivitet: AktivitetType | '';
}
