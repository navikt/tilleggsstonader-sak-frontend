import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';
import { Periode } from '../../../utils/periode';
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
                        <th style="width: 120px; word-wrap: break-word; ${borderStylingCompact}">Stønadsbeløp</th>
                    </tr>
                </thead>
                <tbody>
               ${
                   beregningsresultat?.inneholderUtgifterOvernatting
                       ? lagRaderForVedtakMidlertidigOvernatting(beregningsresultat)
                       : lagRaderForVedtakLøpendeUtgifter(beregningsresultat)
               }
                </tbody>
            </table>`;
};

const lagRaderForVedtakMidlertidigOvernatting = (
    beregningsresultat?: BeregningsresultatBoutgifter
): string => {
    if (!beregningsresultat) {
        return '';
    }
    return beregningsresultat.perioder
        .map((periode) =>
            periode.utgifterTilUtbetaling
                .filter((utgift) => !utgift.erFørRevurderFra)
                .map((utgift) =>
                    lagRadForVedtak(
                        { fom: utgift.fom, tom: utgift.tom },
                        utgift.utgift,
                        utgift.tilUtbetaling,
                        periode.makssatsBekreftet
                    )
                )
                .join('')
        )
        .join('');
};

const lagRaderForVedtakLøpendeUtgifter = (
    beregningsresultat?: BeregningsresultatBoutgifter
): string => {
    if (!beregningsresultat) {
        return '';
    }
    return beregningsresultat.perioder
        .map((periode) =>
            lagRadForVedtak(
                periode,
                periode.sumUtgifter,
                periode.stønadsbeløp,
                periode.makssatsBekreftet
            )
        )
        .join('');
};

const lagRadForVedtak = (
    datoperiode: Periode,
    merutgift: number,
    stønadsbeløp: number,
    makssatsBekreftet: boolean
) => {
    const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);
    const merutgiftString = formaterTallMedTusenSkille(merutgift);
    const stønadsbeløpString = formaterTallMedTusenSkille(stønadsbeløp);
    // const stjernemerktRad = periode.delAvTidligereUtbetaling ? '*' : '';
    const asteriksForSatsendring = makssatsBekreftet ? '' : '*';

    return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${datoperiodeString}</td>
                        <td style="${borderStyling}">${merutgiftString} kr</td>
                        <td style="${borderStyling}">${stønadsbeløpString} kr${asteriksForSatsendring}</td>
                    </tr>`;
};
