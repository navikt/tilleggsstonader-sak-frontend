import { LagVedtakstabell } from './lagVedtakstabell';
import { BeregningsresultatLæremidler } from '../../../typer/vedtak/vedtakLæremidler';
import { formaterTektligIsoPeriode } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export const lagVedtakstabellLæremidler = (
    beregningsresultat: BeregningsresultatLæremidler | undefined
): LagVedtakstabell => {
    const variabelBeregningstabellId = '02408de1-5ad8-44e9-a004-51f677d6ebab';

    return {
        [variabelBeregningstabellId]: lagBeregningstabell(beregningsresultat),
    };
};

const lagBeregningstabell = (beregningsresultat?: BeregningsresultatLæremidler): string => {
    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="width: 270px; word-wrap: break-word; ${borderStylingCompact}">Periode</th>
                        <th style="width: 70px; word-wrap: break-word; ${borderStylingCompact}">Fast sats</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">Beløpet du får</th>
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
            const datoperiode = formaterTektligIsoPeriode(periode.fom, periode.tom);
            const satsPerMåned = formaterTallMedTusenSkille(periode.beløp);
            const stønadsbeløp = formaterTallMedTusenSkille(periode.stønadsbeløp);

            return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${datoperiode}</td>
                        <td style="${borderStyling}">${satsPerMåned} kr</td>
                        <td style="${borderStyling}">${stønadsbeløp} kr</td>
                    </tr>`;
        })
        .join('');
};
