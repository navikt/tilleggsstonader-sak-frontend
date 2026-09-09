import {
    OppsummertBeregningForReise,
    PrivatBilOppsummertBeregning,
} from '../../../Sider/Behandling/VedtakOgBeregning/DagligReise/BeregningFane/typer';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { kronerMedTusenSkilleEllerStrek } from '../../../utils/tekstformatering';

export function lagVedtakstabellPrivatBil(
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined,
    oppsummertBeregningPrivatBil: PrivatBilOppsummertBeregning | undefined
): string {
    if (!behandling || !vedtak) {
        return '';
    }
    if (vedtak.type !== 'INNVILGELSE') {
        return '';
    }

    switch (behandling?.stønadstype) {
        case Stønadstype.DAGLIG_REISE_TSO:
            return lagVedtakstabellDagligReisePrivatBil(oppsummertBeregningPrivatBil);
        case Stønadstype.DAGLIG_REISE_TSR:
            return lagVedtakstabellDagligReisePrivatBil(oppsummertBeregningPrivatBil);
        default:
            return '';
    }
}

function lagVedtakstabellDagligReisePrivatBil(
    oppsummertBeregning: PrivatBilOppsummertBeregning | undefined
): string {
    if (!oppsummertBeregning) return '';

    return oppsummertBeregning.reiser
        .map((reise) => lagVedtakstabellDagligReisePrivatBilPerReise(reise))
        .join('');
}

function lagVedtakstabellDagligReisePrivatBilPerReise(
    oppsummertReise: OppsummertBeregningForReise
): string {
    const perioder = oppsummertReise.perioder.filter((periode) => !periode.fraTidligereVedtak);
    if (perioder.length === 0) return '';

    const harBompengeutgifter = perioder.some((periode) => (periode.bompengerTotalt ?? 0) > 0);
    const harFergekostnader = perioder.some((periode) => (periode.fergekostnadTotalt ?? 0) > 0);

    const rader = perioder
        .map(
            (periode) => `
          <tr>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${periode.ukenummer}</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${formaterIsoPeriodeMedTankestrek(periode)}</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${periode.antallGodkjenteReisedager}</td>
            ${harBompengeutgifter ? `<td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${kronerMedTusenSkilleEllerStrek(periode.bompengerTotalt)}</td>` : ''}
            ${harFergekostnader ? `<td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${kronerMedTusenSkilleEllerStrek(periode.fergekostnadTotalt)}</td>` : ''}
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${kronerMedTusenSkilleEllerStrek(periode.parkeringskostnadTotalt)}</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${kronerMedTusenSkilleEllerStrek(periode.stønadsbeløp)}</td>
          </tr>`
        )
        .join('');

    return `
        <p style="margin-bottom:2px;font-weight:500;">Reise med privat bil til <strong>${oppsummertReise.aktivitetsadresse ?? '-'}</strong>:</p>
        <table style="border-collapse:collapse;border:1px solid #b0b0b0;width:100%;margin:0;">
            <thead>
                <tr>
                    <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:left;">Uke</th>
                    <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:left;">Periode</th>
                    <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:left;">Antall dager</th>
                    ${harBompengeutgifter ? '<th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Bompenger</th>' : ''}
                    ${harFergekostnader ? '<th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Fergekostnad</th>' : ''}
                    <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Parkeringskostnad</th>
                    <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>${rader}</tbody>
        </table>
    `;
}
