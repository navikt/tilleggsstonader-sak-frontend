import {
    BeregningResultatReiseTilSamling,
    BeregningsresultatOffentligTransport,
} from '../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export function lagVedtakstabellReiseTilSamling(
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string {
    if (!beregningsresultat?.offentligTransport) return '';

    const htmlPerSamling = beregningsresultat.offentligTransport.map((samling) => {
        const kolonneOverskrift = `
        <th style="width: 160px; ${borderStylingCompact}">Samling</th>
        <th style="width: 130px; ${borderStylingCompact}">Stønadsbeløp</th>
`;
        const rader = lagRaderForSamling(samling);
        return `
        <p style="margin-bottom: 1px" >Reise til samling <strong>${samling.adresse ?? '-'}</strong>:</p>
        <table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
            <thead><tr>${kolonneOverskrift}</tr></thead>
            <tbody>${rader}</tbody>
        </table>
    `;
    });
    return htmlPerSamling.join('');
}

function lagRaderForSamling(samling: BeregningsresultatOffentligTransport): string {
    const datoperiode: Periode = { fom: samling.fom, tom: samling.tom };
    const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);
    return `
    <tr style="text-align: right;">
        <td style="${borderStylingCompact}">${datoperiodeString ?? '-'}</td>
        <td style="${borderStyling}">${samling.beløp ?? '-'} kr</td>
    </tr>`;
}
