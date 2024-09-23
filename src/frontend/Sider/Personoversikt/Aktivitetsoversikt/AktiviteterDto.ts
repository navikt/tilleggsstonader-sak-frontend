import { Registeraktivitet } from '../../../typer/registeraktivitet';

export interface AktiviteterDto {
    periodeHentetFra: Date;
    periodeHentetTil: Date;
    aktiviteter: Registeraktivitet[];
}
