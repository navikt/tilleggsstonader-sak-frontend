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

export const finnSanityMappe = (
    behandlingstype: BehandlingType,
    vedtakType: TypeVedtak
): string => {
    if (behandlingstype === BehandlingType.REVURDERING) {
        return 'REVURDERING';
    }
    return typeVedtakTilSanitytype(vedtakType);
};

/**
 * Mapper fra type vedtak til typen malen er definert som i Sanity.
 */
const typeVedtakTilSanitytype = (type: TypeVedtak): string => {
    switch (type) {
        case TypeVedtak.INNVILGELSE:
            return 'INNVILGET';
        default:
            return type;
    }
};
