import { PersonopplysningerIBrevmottakere, Valg } from './typer';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { Personopplysninger } from '../../../typer/personopplysninger';
import { TypeVedtak } from '../../../typer/vedtak';

export const idEllerFritekst = (valg?: Valg): string | undefined => {
    switch (valg?._type) {
        case 'tekst':
            return valg?._id;
        case 'fritekst':
            return 'fritekst';
    }
};

enum SanityMappe {
    INNVILGET = 'INNVILGET',
    AVSLAG = 'AVSLAG',
    REVURDERING = 'REVURDERING',
}

/**
 * Finner riktig mappe i sanity basert på vedtaksresultat og behandlingstype.
 */
export const finnSanityMappe = (
    behandlingstype: BehandlingType,
    vedtakType: TypeVedtak
): string[] => {
    // Avslagsbrev er like for revurdering og førstegangsbehandling
    if (vedtakType === TypeVedtak.AVSLAG) {
        return [SanityMappe.AVSLAG];
    }

    if (behandlingstype === BehandlingType.REVURDERING) {
        return [SanityMappe.REVURDERING, SanityMappe.INNVILGET];
    }

    if (vedtakType === TypeVedtak.INNVILGELSE) {
        return [SanityMappe.INNVILGET];
    }

    if (vedtakType === TypeVedtak.OPPHØR) {
        return [SanityMappe.REVURDERING]; //TODO Legg til egen mappe for opphør
    }

    return vedtakType;
};

export const mapPersonopplysningerTilPersonopplysningerIBrevmottakere = (
    personopplysninger: Personopplysninger
): PersonopplysningerIBrevmottakere => {
    return {
        personIdent: personopplysninger.personIdent,
        navn: personopplysninger.navn.visningsnavn,
        harVergemål: personopplysninger.harVergemål,
        vergemål: personopplysninger.vergemål,
    };
};
