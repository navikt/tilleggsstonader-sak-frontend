import { BillettType } from '../../../typer/behandling/behandlingFakta/faktaReise';
import {
    BeregningsresultatDagligReise,
    BeregningsresultatForPeriode,
} from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export function lagVedtakstabellDagligReise(
    beregningsresultat: BeregningsresultatDagligReise | undefined
): string {
    if (!beregningsresultat?.offentligTransport) return '';

    const htmlPerReise = beregningsresultat.offentligTransport.reiser.map((reise) => {
        const perioder = reise.perioder.filter((p) => !p.fraTidligereVedtak);
        if (perioder.length === 0) return '';

        const har30Dager = perioder.some((periode) => {
            const antall = periode.billettdetaljer?.[BillettType.TRETTIDAGERSBILLETT];
            const pris = periode.pris30dagersbillett;
            return visBillettInfo(antall, pris) !== null;
        });

        const har7Dager = perioder.some((periode) => {
            const antall = periode.billettdetaljer?.[BillettType.SYVDAGERSBILLETT];
            const pris = periode.prisSyvdagersbillett;
            return visBillettInfo(antall, pris) !== null;
        });

        const harEnkelt = perioder.some((periode) => {
            const antall = periode.billettdetaljer?.[BillettType.ENKELTBILLETT];
            const pris = periode.prisEnkeltbillett;
            return visBillettInfo(antall, pris) !== null;
        });

        const kolonneOverskrift = `
            <th style="width: 160px; ${borderStylingCompact}">Periode</th>
            <th style="width: 100px; ${borderStylingCompact}">Stønadsbeløp</th>
            ${har30Dager ? `<th style="width: 110px; ${borderStylingCompact}">30-dagersbillett</th>` : ''}
            ${har7Dager ? `<th style="width: 110px; ${borderStylingCompact}">7-dagersbillett</th>` : ''}
            ${harEnkelt ? `<th style="width: 110px; ${borderStylingCompact}">Enkeltbillett</th>` : ''}
    `;

        const rader = lagRaderForReise(perioder, { har30Dager, har7Dager, harEnkelt });

        const reisedagerIUken = (): number => {
            return perioder[0].antallReisedagerPerUke;
        };

        const dagerTekst = reisedagerIUken() > 1 ? 'dager' : 'dag';

        return `
        <p style="margin-bottom: 1px" >Reise med offentlig transport ${reisedagerIUken()} ${dagerTekst} i uken:</p>
        <table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
            <thead><tr>${kolonneOverskrift}</tr></thead>
            <tbody>${rader}</tbody>
        </table>
    `;
    });

    return htmlPerReise.join('<br />');
}

function visBillettInfo(antall: number | undefined, pris: number | undefined): string | null {
    if (!antall || !pris) return null;
    return `${antall} x ${pris} kr`;
}

function lagRaderForReise(
    perioder: BeregningsresultatForPeriode[],
    kolonner?: { har30Dager: boolean; har7Dager: boolean; harEnkelt: boolean }
): string {
    return perioder
        .map((periode) => {
            const { fom, tom, pris30dagersbillett, prisSyvdagersbillett, prisEnkeltbillett } =
                periode;
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
        .join('');
}
