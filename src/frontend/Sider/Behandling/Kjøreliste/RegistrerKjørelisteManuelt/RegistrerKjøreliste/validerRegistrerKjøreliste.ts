import { UkeTilInnsending } from './typer';
import { erEtterDagensDato } from '../../../../../utils/dato';
import { harIkkeVerdi } from '../../../../../utils/utils';
import { ManuellRegistreringReise } from '../typer';

export const validerRegistrerKjøreliste = (
    valgtReiseId: string,
    uker: UkeTilInnsending[],
    journalpostId: string,
    valgtReise: ManuellRegistreringReise | undefined
): string | undefined => {
    if (harIkkeVerdi(valgtReiseId)) {
        return 'Du må velge en reise.';
    }

    if (harIkkeVerdi(journalpostId)) {
        return 'Journalpost-ID må fylles ut.';
    }

    if (uker.length === 0 && valgtReise && erEtterDagensDato(valgtReise.fom)) {
        return 'Reisen starter frem i tid, det er derfor ingen tilgjengelige uker å registrere enda.';
    }

    if (uker.filter((uke) => uke.skalSendesInn).length === 0) {
        return 'Du må registrere minst én uke før du kan gå videre.';
    }

    return undefined;
};
