import {
    Beregningsresultat,
    BeregningsresultatBoutgifter,
} from '../../../typer/vedtak/vedtakBoutgifter';
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
               ${lagRader(beregningsresultat)}
                </tbody>
            </table>
            ${lagTekstForBegrensetAvMakssats(beregningsresultat)}
            `;
};

const lagRader = (beregningsresultat?: BeregningsresultatBoutgifter): string => {
    if (beregningsresultat == null) {
        return '';
    }
    return beregningsresultat.perioder
        .map((periode) =>
            periode.inneholderUtgifterOvernatting
                ? lagRaderForVedtakMidlertidigOvernatting(periode)
                : lagRaderForVedtakLøpendeUtgifter(periode)
        )
        .join('');
};

const lagRaderForVedtakMidlertidigOvernatting = (periode: Beregningsresultat): string => {
    return periode.utgifter
        .filter((utgift) => !utgift.erFørTidligsteEndring)
        .map((utgift) =>
            lagRadForVedtak(
                { fom: utgift.fom, tom: utgift.tom },
                utgift.utgift,
                utgift.tilUtbetaling,
                periode.makssatsBekreftet,
                utgift.utgift > utgift.tilUtbetaling,
                utgift.skalFåDekketFaktiskeUtgifter
            )
        )
        .join('');
};

const lagRaderForVedtakLøpendeUtgifter = (periode: Beregningsresultat): string => {
    return lagRadForVedtak(
        periode,
        periode.sumUtgifter,
        periode.stønadsbeløp,
        periode.makssatsBekreftet,
        false,
        periode.skalFåDekketFaktiskeUtgifter
    );
};

const lagRadForVedtak = (
    datoperiode: Periode,
    merutgift: number,
    stønadsbeløp: number,
    makssatsBekreftet: boolean,
    begrensetAvMakssats: boolean,
    skalFåDekketFaktiskeUtgifter: boolean
) => {
    const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);
    const merutgiftString = formaterTallMedTusenSkille(merutgift);
    const stønadsbeløpString = formaterTallMedTusenSkille(stønadsbeløp);
    const asteriksForSatsendring = !skalFåDekketFaktiskeUtgifter && !makssatsBekreftet ? '*' : '';
    const asteriksForBegrensetAvMakssats =
        !skalFåDekketFaktiskeUtgifter && begrensetAvMakssats ? '*' : '';
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
    beregningsresultat?.perioder.some(
        (periode) =>
            periode.inneholderUtgifterOvernatting &&
            periode.utgifter.some((utgift) => utgift.tilUtbetaling < utgift.utgift)
    );
