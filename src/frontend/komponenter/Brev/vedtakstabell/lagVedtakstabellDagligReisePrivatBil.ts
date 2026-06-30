import {
    OppsummertBeregningForReise,
    PrivatBilOppsummertBeregning,
} from '../../../Sider/Behandling/VedtakOgBeregning/DagligReise/BeregningFane/typer';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { kronerMedTusenSkilleEllerStrek } from '../../../utils/tekstformatering';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

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
            <td style="text-align: right; ${borderStyling}">${periode.ukenummer}</td>
            <td style="min-width: 140px; ${borderStyling}">${formaterIsoPeriodeMedTankestrek(periode)}</td>
            <td style="text-align: right; ${borderStyling}">${periode.antallGodkjenteReisedager}</td>
            ${harBompengeutgifter ? `<td style="text-align: right; ${borderStyling}">${kronerMedTusenSkilleEllerStrek(periode.bompengerTotalt)}</td>` : ''}
            ${harFergekostnader ? `<td style="text-align: right; ${borderStyling}">${kronerMedTusenSkilleEllerStrek(periode.fergekostnadTotalt)}</td>` : ''}
            <td style="text-align: right; ${borderStyling}">${kronerMedTusenSkilleEllerStrek(periode.parkeringskostnadTotalt)}</td>
            <td style="text-align: right; ${borderStyling}">${kronerMedTusenSkilleEllerStrek(periode.stønadsbeløp)}</td>
        </tr>`
        )
        .join('');

    return `
        <p style="margin-bottom:2px;font-weight:500;">Reise med privat bil til <strong>${oppsummertReise.aktivitetsadresse ?? '-'}</strong>:</p>
        <div>
            <table style="font-size: 89%; margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="${borderStylingCompact}">Uke</th>
                        <th style="${borderStylingCompact}">Periode</th>
                        <th style="${borderStylingCompact}">Antall dager</th>
                        ${harBompengeutgifter ? `<th style="${borderStylingCompact}">Bompenger</th>` : ''}
                        ${harFergekostnader ? `<th style="${borderStylingCompact}">Fergekostnad</th>` : ''}
                        <th style="${borderStylingCompact}">Parkeringskostnad</th>
                        <th style="${borderStylingCompact}">Stønadsbeløp</th>
                    </tr>
                </thead>
                <tbody>${rader}</tbody>
            </table>
        </div>
    `;
}
