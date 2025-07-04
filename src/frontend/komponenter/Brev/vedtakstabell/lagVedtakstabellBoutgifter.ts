import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../utils/fomatering';
import { Periode } from '../../../utils/periode';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export const lagVedtakstabellBoutgifter = (
    beregningsresultat: BeregningsresultatBoutgifter | undefined
): string => {
    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="width: 270px; word-wrap: break-word; ${borderStylingCompact}">Periode</th>
                        <th style="width: 120px; word-wrap: break-word; ${borderStylingCompact}">Merutgift</th>
                        <th style="width: 180px; word-wrap: break-word; ${borderStylingCompact}">Beløp du har rett til</th>
                    </tr>
                </thead>
                <tbody>
               ${
                   beregningsresultat?.inneholderUtgifterOvernatting
                       ? lagRaderForVedtakMidlertidigOvernatting(beregningsresultat)
                       : lagRaderForVedtakLøpendeUtgifter(beregningsresultat)
               }
                </tbody>
            </table>
            ${lagTekstForBegrensetAvMakssats(beregningsresultat)}
            `;
};

const lagRaderForVedtakMidlertidigOvernatting = (
    beregningsresultat?: BeregningsresultatBoutgifter
): string => {
    if (!beregningsresultat) {
        return '';
    }
    return beregningsresultat.perioder
        .map((periode) =>
            periode.utgifter
                .filter((utgift) => !utgift.erFørRevurderFra)
                .map((utgift) =>
                    lagRadForVedtak(
                        { fom: utgift.fom, tom: utgift.tom },
                        utgift.utgift,
                        utgift.tilUtbetaling,
                        periode.makssatsBekreftet,
                        utgift.utgift > utgift.tilUtbetaling
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
                periode.makssatsBekreftet,
                false
            )
        )
        .join('');
};

const lagRadForVedtak = (
    datoperiode: Periode,
    merutgift: number,
    stønadsbeløp: number,
    makssatsBekreftet: boolean,
    begrensetAvMakssats: boolean
) => {
    const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);
    const merutgiftString = formaterTallMedTusenSkille(merutgift);
    const stønadsbeløpString = formaterTallMedTusenSkille(stønadsbeløp);
    const asteriksForSatsendring = makssatsBekreftet ? '' : '*';
    const asteriksForBegrensetAvMakssats = begrensetAvMakssats ? '*' : '';

    return `<tr style="text-align: right;">
                        <td style="text-align: left; ${borderStylingCompact}">${datoperiodeString}</td>
                        <td style="${borderStyling}">${merutgiftString} kr</td>
                        <td style="${borderStyling}">${stønadsbeløpString} kr ${asteriksForSatsendring}${asteriksForBegrensetAvMakssats}</td>
                    </tr>`;
};

const lagTekstForBegrensetAvMakssats = (beregningsresultat?: BeregningsresultatBoutgifter) =>
    skalHaTekstForBegrensetAvMakssats(beregningsresultat)
        ? `<p style="margin-left: 2px; margin-right: 2px; margin-top: 1px; padding: 0;">
                    *beløpet er redusert på grunn av makssats
                </p>`
        : '';

const skalHaTekstForBegrensetAvMakssats = (beregningsresultat?: BeregningsresultatBoutgifter) =>
    beregningsresultat?.inneholderUtgifterOvernatting &&
    beregningsresultat.perioder.some((periode) =>
        periode.utgifter.some((utgift) => utgift.tilUtbetaling < utgift.utgift)
    );
