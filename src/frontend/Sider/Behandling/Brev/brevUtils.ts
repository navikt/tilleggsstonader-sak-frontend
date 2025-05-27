import { BrevmalResultat } from '../../../komponenter/Brev/typer';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { TypeVedtak } from '../../../typer/vedtak/vedtak';
import { erProd } from '../../../utils/miljø';

/**
 * Finner riktig mappe i sanity basert på vedtaksresultat og behandlingstype.
 */
export const finnSanityMappe = (
    behandlingstype: BehandlingType,
    vedtakType: TypeVedtak
): BrevmalResultat[] => {
    // Avslagsbrev er like for revurdering og førstegangsbehandling
    if (vedtakType === TypeVedtak.AVSLAG) {
        return [BrevmalResultat.AVSLAG];
    }
    if (vedtakType === TypeVedtak.OPPHØR) {
        return [BrevmalResultat.OPPHØR];
    }

    if (behandlingstype === BehandlingType.REVURDERING) {
        return [BrevmalResultat.REVURDERING, BrevmalResultat.INNVILGET];
    }

    // Midlertidig visning av opphør og revurdering i dev for testing
    if (vedtakType === TypeVedtak.INNVILGELSE && !erProd()) {
        return [BrevmalResultat.INNVILGET, BrevmalResultat.OPPHØR, BrevmalResultat.REVURDERING];
    }

    if (vedtakType === TypeVedtak.INNVILGELSE) {
        return [BrevmalResultat.INNVILGET];
    }

    return [];
};
