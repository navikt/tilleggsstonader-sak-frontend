import {
    BeregningResultatReiseTilSamling,
    BeregningsresultatOffentligTransport,
    BeregningsresultatPrivatBil,
} from '../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';
import { kronerMedTusenSkilleEllerStrek } from '../../../utils/tekstformatering';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export function lagVedtakstabellReiseTilSamling(
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string {
    return (
        lagVedtakstabellReiseTilSamlingOffentligTranport(beregningsresultat) +
        lagVedtakstabellReiseTilSamlingPrivatBil(beregningsresultat)
    );
}

export function lagVedtakstabellReiseTilSamlingOffentligTranport(
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string {
    if (!beregningsresultat?.offentligTransport) return '';

    const htmlPerSamling = beregningsresultat.offentligTransport.map((samling) => {
        const kolonneOverskrift = `
        <th style="width: 160px; ${borderStylingCompact}">Samling</th>
        <th style="width: 130px; ${borderStylingCompact}">Stønadsbeløp</th>
`;
        const rader = lagRaderForReiseTilSamlingOffentligTransport(samling);
        return `
        <p style="margin-bottom:2px;font-weight:500;">Reise til samling med offentlig transport til <strong>${samling.adresse ?? '-'}</strong>:</p>
        <table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
            <thead><tr>${kolonneOverskrift}</tr></thead>
            <tbody>${rader}</tbody>
        </table>
    `;
    });
    return htmlPerSamling.join('');
}

function lagRaderForReiseTilSamlingOffentligTransport(
    samling: BeregningsresultatOffentligTransport
): string {
    const datoperiode: Periode = { fom: samling.fom, tom: samling.tom };
    const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);
    return `
    <tr>
        <td style="${borderStylingCompact}">${datoperiodeString ?? '-'}</td>
        <td style="${borderStyling}">${samling.beløp ?? '-'} kr</td>
    </tr>`;
}

function lagVedtakstabellReiseTilSamlingPrivatBil(
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string {
    if (!beregningsresultat?.privatBil) return '';

    return beregningsresultat.privatBil
        .map((samling) => lagVedtakstabellReiseTilSamlingPrivatBilPerSamling(samling))
        .join('');
}

function lagVedtakstabellReiseTilSamlingPrivatBilPerSamling(
    samling: BeregningsresultatPrivatBil
): string {
    const harBompengeutgifter = (samling.bompenger ?? 0) > 0;
    const harFergekostnader = (samling.fergekostnad ?? 0) > 0;
    const periode = { fom: samling.fom, tom: samling.tom };

    const rader = `
          <tr>
            <td style="${borderStylingCompact}">${formaterIsoPeriodeMedTankestrek(periode)}</td>
            ${harBompengeutgifter ? `<td style="${borderStylingCompact}">${kronerMedTusenSkilleEllerStrek(samling.bompenger)}</td>` : ''}
            ${harFergekostnader ? `<td style="${borderStylingCompact}">${kronerMedTusenSkilleEllerStrek(samling.fergekostnad)}</td>` : ''}
            <td style="${borderStylingCompact}">${kronerMedTusenSkilleEllerStrek(samling.parkering)}</td>
            <td style="${borderStylingCompact}">${kronerMedTusenSkilleEllerStrek(samling.beløp)}</td>
          </tr>`;

    return `
        <p style="margin-bottom:2px;font-weight:500;">Reise til samling med privat bil til <strong>${samling.adresse ?? '-'}</strong>:</p>
        <table style="border-collapse:collapse;border:1px solid #b0b0b0;width:100%;margin:0;">
            <thead>
                <tr>
                    <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:left;">Periode</th>
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
