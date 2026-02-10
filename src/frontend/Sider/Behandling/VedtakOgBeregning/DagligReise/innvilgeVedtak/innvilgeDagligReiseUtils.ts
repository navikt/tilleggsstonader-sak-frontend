import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    tilVedtaksperioderTso,
    VedtaksperiodeTso,
} from '../../Felles/vedtaksperioder/vedtaksperiodeDtoUtil';

export type VedtaksperiodeTsrDto = Omit<Vedtaksperiode, 'målgruppeType' | 'aktivitetType'>;

export const tilVedtaksperioderDto = (
    perioder: Vedtaksperiode[],
    stønadstype: Stønadstype
): VedtaksperiodeTso[] | VedtaksperiodeTsrDto[] => {
    if (stønadstype === Stønadstype.DAGLIG_REISE_TSR) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return perioder.map(({ målgruppeType, aktivitetType, ...rest }) => rest);
    }
    return tilVedtaksperioderTso(perioder);
};
