import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export type VedtaksperiodeTso = Vedtaksperiode;

export const tilVedtaksperioderTso = (perioder: Vedtaksperiode[]): VedtaksperiodeTso[] => perioder;
