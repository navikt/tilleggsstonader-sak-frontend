import { BeregningsresultatLæremidler } from '../../../typer/vedtak/vedtakLæremidler';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export const lagVedtakstabellLæremidler = (
    beregningsresultat?: BeregningsresultatLæremidler
): string => {
    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="width: 270px; word-wrap: break-word; ${borderStylingCompact}">Periode</th>
                        <th style="width: 120px; ${borderStylingCompact}">Antall måneder</th>
                        <th style="width: 70px; word-wrap: break-word; ${borderStylingCompact}">Sats</th>
                        <th style="width: 80px; word-wrap: break-word; ${borderStylingCompact}">Beløp</th>
                    </tr>
                </thead>
                <tbody>
                    ${lagRaderForVedtak(beregningsresultat)}
                </tbody>
            </table>`;
};

const lagRaderForVedtak = (beregningsresultat?: BeregningsresultatLæremidler): string => {
    if (!beregningsresultat) {
        return '';
    }
    return beregningsresultat.perioder
        .map((periode) => {
            const datoperiode = formaterIsoPeriodeMedTankestrek(periode);
            const satsPerMåned = formaterTallMedTusenSkille(periode.beløp);
            const stønadsbeløp = formaterTallMedTusenSkille(periode.stønadsbeløp);
            const stjernmerktRad = periode.delAvTidligereUtbetaling ? '*' : '';

            return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${datoperiode}</td>
                        <td style="${borderStyling}">${periode.antallMåneder}</td>
                        <td style="${borderStyling}">${satsPerMåned} kr</td>
                        <td style="${borderStyling}">${stønadsbeløp} kr${stjernmerktRad}</td>
                    </tr>`;
        })
        .join('');
};
