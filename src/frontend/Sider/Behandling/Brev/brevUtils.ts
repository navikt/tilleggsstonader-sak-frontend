import { Valg } from './typer';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
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
): string => {
    // Avslagsbrev er like for revurdering og førstegangsbehandling
    if (vedtakType === TypeVedtak.AVSLAG) {
        return SanityMappe.AVSLAG;
    }

    if (behandlingstype === BehandlingType.REVURDERING) {
        return SanityMappe.AVSLAG;
    }

    if (vedtakType === TypeVedtak.INNVILGELSE) {
        return SanityMappe.INNVILGET;
    }

    return vedtakType;
};
