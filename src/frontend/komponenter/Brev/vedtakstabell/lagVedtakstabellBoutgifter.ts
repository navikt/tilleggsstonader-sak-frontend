import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';
import { variabelBeregningstabellId } from '../variablerUtils';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export const lagVedtakstabellBoutgifter = (
    beregningsresultat: BeregningsresultatBoutgifter | undefined
) => {
    return {
        [variabelBeregningstabellId]: lagBeregningstabell(beregningsresultat),
    };
};

const lagBeregningstabell = (
    beregningsresultat: BeregningsresultatBoutgifter | undefined
): string => {
    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="width: 270px; word-wrap: break-word; ${borderStylingCompact}">Periode</th>
                        <th style="width: 120px; word-wrap: break-word; ${borderStylingCompact}">Merutgift</th>
                        <th style="width: 120px; word-wrap: break-word; ${borderStylingCompact}">Beløpet du får</th>
                    </tr>
                </thead>
                <tbody>
                    ${lagRaderForVedtak(beregningsresultat)}
                </tbody>
            </table>`;
};

const lagRaderForVedtak = (beregningsresultat?: BeregningsresultatBoutgifter): string => {
    if (!beregningsresultat) {
        return '';
    }
    return beregningsresultat.perioder
        .map((periode) => {
            const datoperiode = formaterIsoPeriodeMedTankestrek(periode);
            const merutgift = formaterTallMedTusenSkille(periode.sumUtgifter);
            const stønadsbeløp = formaterTallMedTusenSkille(periode.stønadsbeløp);
            // const stjernemerktRad = periode.delAvTidligereUtbetaling ? '*' : '';
            const asteriksForSatsendring = periode.makssatsBekreftet ? '' : '*';

            return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${datoperiode}</td>
                        <td style="${borderStyling}">${merutgift} kr</td>
                        <td style="${borderStyling}">${stønadsbeløp} kr${asteriksForSatsendring}</td>
                    </tr>`;
        })
        .join('');
};
