import { Periode } from '../../../../utils/periode';
import { AktivitetType } from '../typer/aktivitet';

export interface AktivitetValidering extends Periode {
    type: AktivitetType | '';
    begrunnelse?: string;
}
