import { AktivitetType } from './aktivitet';
import { MålgruppeType } from './målgruppe';
import { Periode } from '../../../../utils/periode';

/**
 * @field _ulagretId er en temporær nøkkel på stønadsperioden før stønadsperioden har blitt lagret.
 * For å kunne sette en key på raden sånn at sletting av rad får meg seg riktige datoer. Eks legger inn 2 rader, sletter rad 1.
 */
export interface Stønadsperiode extends Periode {
    _ulagretId?: string;
    id?: string;
    målgruppe: MålgruppeType | '';
    aktivitet: AktivitetType | '';
}
