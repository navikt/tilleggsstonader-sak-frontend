import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { TypeVedtak } from '../../../typer/vedtak/vedtak';
import { erProd } from '../../../utils/miljø';

enum SanityMappe {
    INNVILGET = 'INNVILGET',
    AVSLAG = 'AVSLAG',
    REVURDERING = 'REVURDERING',
    OPPHØR = 'OPPHOR',
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
    if (vedtakType === TypeVedtak.OPPHØR) {
        return [SanityMappe.OPPHØR];
    }

    if (behandlingstype === BehandlingType.REVURDERING) {
        return [SanityMappe.REVURDERING, SanityMappe.INNVILGET];
    }

    // Midlertidig visning av opphørsbrev i dev for testing
    if (vedtakType === TypeVedtak.INNVILGELSE && !erProd()) {
        return [SanityMappe.INNVILGET, SanityMappe.OPPHØR];
    }

    if (vedtakType === TypeVedtak.INNVILGELSE) {
        return [SanityMappe.INNVILGET];
    }

    return vedtakType;
};
