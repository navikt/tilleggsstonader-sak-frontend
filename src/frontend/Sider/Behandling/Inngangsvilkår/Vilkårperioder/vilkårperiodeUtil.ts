import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';

export const kanRegisterAktivitetBrukes = (
    registerAktivtet: Registeraktivitet,
    stønadstype: Stønadstype
): boolean => !(stønadstype === Stønadstype.DAGLIG_REISE_TSR && registerAktivtet.erUtdanning);
