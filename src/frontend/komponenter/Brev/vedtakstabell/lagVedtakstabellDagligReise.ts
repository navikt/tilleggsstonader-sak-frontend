import { BillettType } from '../../../typer/behandling/behandlingFakta/faktaReise';
import { BeregningsresultatDagligReise } from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export const lagVedtakstabellDagligReise = (
    beregningsresultat: BeregningsresultatDagligReise | undefined
): string => {
    if (!beregningsresultat?.offentligTransport) return '';

    const allePerioder = beregningsresultat.offentligTransport.reiser.flatMap(
        (reise) => reise.perioder
    );

    const har30Dager = allePerioder.some((periode) => {
        const antall = periode.billettdetaljer?.[BillettType.TRETTIDAGERSBILLETT];
        const pris = periode.grunnlag.pris30dagersbillett;
        return visBillettInfo(antall, pris) !== null;
    });

    const har7Dager = allePerioder.some((periode) => {
        const antall = periode.billettdetaljer?.[BillettType.SYVDAGERSBILLETT];
        const pris = periode.grunnlag.prisSyvdagersbillett;
        return visBillettInfo(antall, pris) !== null;
    });

    const harEnkelt = allePerioder.some((periode) => {
        const antall = periode.billettdetaljer?.[BillettType.ENKELTBILLETT];
        const pris = periode.grunnlag.prisEnkeltbillett;
        return visBillettInfo(antall, pris) !== null;
    });

    const kolonneOverskrift = `
        <th style="width: 150px; ${borderStylingCompact}">Periode</th>
        <th style="width: 110px; ${borderStylingCompact}">Beløp du har rett til</th>
        ${har30Dager ? `<th style="width: 110px; ${borderStylingCompact}">30-dagersbillett</th>` : ''}
        ${har7Dager ? `<th style="width: 100px; ${borderStylingCompact}">7-dagersbillett</th>` : ''}
        ${harEnkelt ? `<th style="width: 100px; ${borderStylingCompact}">Enkeltbillett</th>` : ''}
    `;

    const rader = lagRaderForVedtak(beregningsresultat, { har30Dager, har7Dager, harEnkelt });

    return `
        <table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
            <thead><tr>${kolonneOverskrift}</tr></thead>
            <tbody>${rader}</tbody>
        </table>
    `;
};

const visBillettInfo = (antall: number | undefined, pris: number | undefined): string | null => {
    if (!antall || !pris) return null;
    return `${antall} x ${pris} kr`;
};

const lagRaderForVedtak = (
    beregningsresultat?: BeregningsresultatDagligReise,
    kolonner?: { har30Dager: boolean; har7Dager: boolean; harEnkelt: boolean }
): string => {
    if (!beregningsresultat?.offentligTransport) return '';

    return beregningsresultat.offentligTransport.reiser
        .flatMap((reise) =>
            reise.perioder.map((periode) => {
                const { fom, tom, pris30dagersbillett, prisSyvdagersbillett, prisEnkeltbillett } =
                    periode.grunnlag;
                const beløp = periode.beløp;
                const antall30dagersbilletter =
                    periode.billettdetaljer?.[BillettType.TRETTIDAGERSBILLETT];
                const antallSyvdagersbilletter =
                    periode.billettdetaljer?.[BillettType.SYVDAGERSBILLETT];
                const antallEnkeltbilletter = periode.billettdetaljer?.[BillettType.ENKELTBILLETT];

                const datoperiode: Periode = { fom, tom };
                const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);

                return `<tr style="text-align: right;">
                    <td style="text-align: left; ${borderStylingCompact}">${datoperiodeString}</td>
                    <td style="${borderStyling}">${beløp} kr</td>
                    ${kolonner?.har30Dager ? `<td style="${borderStyling}">${visBillettInfo(antall30dagersbilletter, pris30dagersbillett) ?? ''}</td>` : ''}
                    ${kolonner?.har7Dager ? `<td style="${borderStyling}">${visBillettInfo(antallSyvdagersbilletter, prisSyvdagersbillett) ?? ''}</td>` : ''}
                    ${kolonner?.harEnkelt ? `<td style="${borderStyling}">${visBillettInfo(antallEnkeltbilletter, prisEnkeltbillett) ?? ''}</td>` : ''}
                </tr>`;
            })
        )
        .join('');
};
