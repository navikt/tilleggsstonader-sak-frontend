import { lagRammevedtakstabellMedDelperioder } from './lagRammevedtakstabellMedDelperioder';
import { lagRammevedtakstabellUtenDelperioder } from './lagRammevedtakstabellUtenDelperioder';
import { VedtakDagligReise } from '../../../../typer/vedtak/vedtakDagligReise';
import { tilDato } from '../../../../utils/dato';

export function lagRammevedtakstabell(vedtak: VedtakDagligReise | undefined): string {
    if (!vedtak) return '';
    if (vedtak.type !== 'INNVILGELSE') return '';
    if (!vedtak.rammevedtakPrivatBil) return '';

    const htmlPerReise = vedtak.rammevedtakPrivatBil.reiser.map((reise) => {
        const skalViseTabellMedDelperioder = reise.delperioder.length !== 1;

        const harUbekreftetSats = reise.delperioder.some((delperiode) =>
            delperiode.satser.some((sats) => !sats.satsBekreftetVedVedtakstidspunkt)
        );

        const årForUbekreftedeSatser = reise.delperioder
            .flatMap((delperiode) => delperiode.satser)
            .filter((sats) => !sats.satsBekreftetVedVedtakstidspunkt)
            .map((sats) => tilDato(sats.fom).getFullYear());

        const utledÅrForFørsteSatsjustering =
            årForUbekreftedeSatser.length > 0 ? Math.min(...årForUbekreftedeSatser) : undefined;

        return `
        <p style="margin-bottom:2px;font-weight:500;">Reise med privat bil til <strong>${reise.aktivitetsadresse ?? '-'}</strong>:</p>
        ${skalViseTabellMedDelperioder ? lagRammevedtakstabellMedDelperioder(reise) : lagRammevedtakstabellUtenDelperioder(reise)}
        ${harUbekreftetSats && utledÅrForFørsteSatsjustering ? `<p>* Fra 1. januar ${utledÅrForFørsteSatsjustering} kan kilometersatsene for daglig reise med bil bli endret. Derfor kan beløpet du får utbetalt fra januar ${utledÅrForFørsteSatsjustering}, være et annet enn det som står i utbetalingsplanen.</p>` : ''}
        `;
    });

    return htmlPerReise.join('');
}
