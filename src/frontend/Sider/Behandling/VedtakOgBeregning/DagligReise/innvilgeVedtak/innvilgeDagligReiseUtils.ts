import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export type VedtaksperiodeTsrDto = Omit<Vedtaksperiode, 'målgruppeType' | 'aktivitetType'>;

export const tilVedtaksperioderDto = (
    perioder: Vedtaksperiode[],
    stønadstype: Stønadstype
): Vedtaksperiode[] | VedtaksperiodeTsrDto[] => {
    if (stønadstype === Stønadstype.DAGLIG_REISE_TSR) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return perioder.map(({ målgruppeType, aktivitetType, ...rest }) => rest);
    }
    return perioder;
};
