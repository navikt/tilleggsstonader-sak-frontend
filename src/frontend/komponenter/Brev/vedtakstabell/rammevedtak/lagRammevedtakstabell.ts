import { lagRammevedtakstabellMedDelperioder } from './lagRammevedtakstabellMedDelperioder';
import { lagRammevedtakstabellUtenDelperioder } from './lagRammevedtakstabellUtenDelperioder';
import { Behandling } from '../../../../typer/behandling/behandling';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../../typer/vedtak/vedtak';
import { VedtakDagligReise } from '../../../../typer/vedtak/vedtakDagligReise';
import { tilDato } from '../../../../utils/dato';

export function lagRammevedtakstabell(
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined
): string {
    if (!behandling || !vedtak) return '';
    if (!erVedtakDagligReise(behandling, vedtak)) return '';
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

function erVedtakDagligReise(
    behandling: Behandling,
    vedtak: VedtakResponse
): vedtak is VedtakDagligReise {
    return (
        behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSO ||
        behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSR
    );
}
