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
const borderStylingWithNewline = `${borderStyling} white-space: pre-line;`;

export function lagVedtakstabellReiseTilSamling(
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string {
    return (
        lagVedtakstabellReiseTilSamlingOffentligTransport(beregningsresultat) +
        lagVedtakstabellReiseTilSamlingPrivatBil(beregningsresultat)
    );
}

export function lagVedtakstabellReiseTilSamlingOffentligTransport(
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string {
    if (!beregningsresultat?.offentligTransport) return '';

    const nyeSamlinger = beregningsresultat.offentligTransport.filter(
        (samling) => !samling.fraTidligereVedtak
    );

    const htmlPerSamling = nyeSamlinger.map((samling) => {
        const datoperiode: Periode = { fom: samling.fom, tom: samling.tom };

        const kolonneOverskrift = `
        <th style="width: 130px; ${borderStylingCompact}">Stønadsbeløp</th>
        <th style="width: 240px; ${borderStylingCompact}">Spesifikasjon av stønadsbeløp</th>
`;
        const rader = lagRaderForReiseTilSamlingOffentligTransport(samling);
        return `
        <p style="margin-bottom:2px;font-weight:500;">Reise til samling med offentlig transport til <strong>${samling.adresse ?? '-'}</strong> (${formaterIsoPeriodeMedTankestrek(datoperiode)}):</p>
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
    return `
    <tr>
        <td style="${borderStyling}">${kronerMedTusenSkilleEllerStrek(samling.beløp)}</td>
        <td style="${borderStylingWithNewline}">${samling.begrunnelse}</td>
    </tr>`;
}

function lagVedtakstabellReiseTilSamlingPrivatBil(
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string {
    if (!beregningsresultat?.privatBil) return '';

    return beregningsresultat.privatBil
        .filter((samling) => !samling.fraTidligereVedtak)
        .map((samling) => lagVedtakstabellReiseTilSamlingPrivatBilPerSamling(samling))
        .join('');
}

function lagVedtakstabellReiseTilSamlingPrivatBilPerSamling(
    samling: BeregningsresultatPrivatBil
): string {
    const periode = { fom: samling.fom, tom: samling.tom };

    const ekstraKostnader =
        (samling.bompenger ?? 0) + (samling.fergekostnad ?? 0) + (samling.piggdekkavgift ?? 0);

    const rader = `
          <tr>
            <td style="${borderStylingCompact}">${samling.totalReiseavstand} km</td>
            <td style="${borderStylingCompact}">${samling.sats} kr/km</td>
            <td style="${borderStylingCompact}">${ekstraKostnader} kr</td>
            <td style="${borderStylingCompact}">${samling.parkering} kr</td>
            <td style="${borderStylingCompact}">${samling.beløp} kr</td>
          </tr>`;

    return `
        <p style="margin-bottom:2px;font-weight:500;">Reise til samling med privat bil til <strong>${samling.adresse ?? '-'}</strong> (${formaterIsoPeriodeMedTankestrek(periode)}):</p>
            <table style="border-collapse: collapse; margin: 0; ${borderStylingCompact}">
    <thead>
        <tr>
            <th style="width: 150px; ${borderStylingCompact}">Total reiseavstand</th>
            <th style="width: 130px; ${borderStylingCompact}">Kilometersats</th>
            <th style="width: 120px; ${borderStylingCompact}">Ekstrakostnader</th>
            <th style="width: 90px; ${borderStylingCompact}">Parkering</th>
            <th style="width: 110px; ${borderStylingCompact}">Stønadsbeløp</th>
        </tr>
    </thead>
    <tbody>${rader}</tbody>
</table>
`;
}
