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
        <table style="border-collapse: collapse; width: 100%; margin: 0;">
            <table style="border-collapse: collapse; width: 100%; margin: 0; ${borderStylingCompact}">
    <thead>
        <tr>
            <th style="width: 170px; ${borderStylingCompact}">Periode</th>
            ${harBompengeutgifter ? `<th style="width: 130px; ${borderStylingCompact}">Bompenger</th>` : ''}
            ${harFergekostnader ? `<th style="width: 130px; ${borderStylingCompact}">Fergekostnad</th>` : ''}
            <th style="width: 130px; ${borderStylingCompact}">Parkeringskostnad</th>
            <th style="width: 130px; ${borderStylingCompact}">Stønadsbeløp</th>
        </tr>
    </thead>
    <tbody>${rader}</tbody>
</table>
`;
}
