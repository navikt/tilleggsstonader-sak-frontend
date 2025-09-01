import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { erDatoFørEllerLik } from '../../../../utils/dato';
import { YtelseGrunnlagPeriode } from '../typer/vilkårperiode/vilkårperiode';

/**
 * Brukes for å vite om en ytelse/aktivitet hentet fra register kan brukes i en behandling
 * Den kan alltid brukes i en førstegangsbehandling
 * Hvis det er en revurdering kan den kun brukes dersom det revurderes i eller før perioden som er hentet
 */
export const kanRegisterperiodeBrukes = (
    registerPeriode: YtelseGrunnlagPeriode | Registeraktivitet,
    revurderFra?: string
) => {
    if (!revurderFra) return true;
    if (!registerPeriode.fom) return false;

    return !registerPeriode.tom || erDatoFørEllerLik(revurderFra, registerPeriode.tom);
};

export const kanRegisterAktivitetBrukes = (
    registerAktivtet: Registeraktivitet,
    stønadstype: Stønadstype
): boolean => !(stønadstype === Stønadstype.DAGLIG_REISE_TSR && registerAktivtet.erUtdanning);
