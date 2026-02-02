import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export const tilVedtaksperioderDto = (
    perioder: Vedtaksperiode[],
    stønadstype: Stønadstype
): Vedtaksperiode[] | Omit<Vedtaksperiode, 'målgruppeType' | 'aktivitetType'>[] => {
    if (stønadstype === Stønadstype.DAGLIG_REISE_TSR) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return perioder.map(({ målgruppeType, aktivitetType, ...rest }) => rest);
    }
    return perioder;
};
