import { UkeTilInnsending } from './typer';
import { harIkkeVerdi } from '../../../../../utils/utils';

export const validerRegistrerKjøreliste = (
    valgtReiseId: string,
    uker: UkeTilInnsending[],
    journalpostId: string
): string | undefined => {
    if (harIkkeVerdi(valgtReiseId)) {
        return 'Du må velge en reise.';
    }

    if (harIkkeVerdi(journalpostId)) {
        return 'Journalpost-ID må fylles ut.';
    }

    if (uker.filter((uke) => uke.skalSendesInn).length === 0) {
        return 'Du må registrere minst én uke før du kan gå videre.';
    }

    return undefined;
};
