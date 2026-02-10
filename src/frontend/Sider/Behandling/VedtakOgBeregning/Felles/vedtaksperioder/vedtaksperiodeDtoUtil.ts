import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export type VedtaksperiodeTso = Omit<Vedtaksperiode, 'typeAktivitet'>;

// Brukes for stønadstyper som gjelder nay hvor man ikke bryr seg om typeAktivitet
export const tilVedtaksperioderTso = (perioder: Vedtaksperiode[]): VedtaksperiodeTso[] =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    perioder.map(({ typeAktivitet, ...rest }) => rest);
