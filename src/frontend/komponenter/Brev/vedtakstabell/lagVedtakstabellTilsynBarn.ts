import { LagVedtakstabell } from './lagVedtakstabell';
import { BeregningsresultatTilsynBarn } from '../../../typer/vedtak/vedtakTilsynBarn';
import { formaterÅrMåned } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';
import { toTitleCase } from '../../../utils/tekstformatering';
import { variabelBeregningstabellId } from '../variablerUtils';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export const lagVedtakstabellTilsynBarn = (
    beregningsresultat: BeregningsresultatTilsynBarn | undefined
): LagVedtakstabell => {
    return {
        [variabelBeregningstabellId]: lagBeregningstabell(beregningsresultat),
    };
};

const lagBeregningstabell = (beregningsresultat?: BeregningsresultatTilsynBarn): string => {
    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="width: 110px; ${borderStylingCompact}">Måned</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">Antall barn</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">Utgift</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">Stønadsbeløp</th>
                    </tr>
                </thead>
                <tbody>
                    ${lagRaderForVedtak(beregningsresultat)}
                </tbody>
            </table>`;
};

const lagRaderForVedtak = (beregningsresultat?: BeregningsresultatTilsynBarn): string => {
    if (!beregningsresultat) {
        return '';
    }
    return beregningsresultat.perioder
        .map((periode) => {
            const datoperiode = `${toTitleCase(formaterÅrMåned(periode.grunnlag.måned))}`;
            const månedligUtgifter = formaterTallMedTusenSkille(periode.grunnlag.utgifterTotal);
            const beløp = formaterTallMedTusenSkille(periode.månedsbeløp);

            return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${datoperiode}</td>
                        <td style="${borderStyling}">${periode.grunnlag.antallBarn}</td>
                        <td style="${borderStyling}">${månedligUtgifter} kr</td>
                        <td style="${borderStyling}">${beløp} kr</td>
                    </tr>`;
        })
        .join('');
};
