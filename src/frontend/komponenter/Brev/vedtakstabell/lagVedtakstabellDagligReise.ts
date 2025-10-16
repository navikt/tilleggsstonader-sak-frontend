import { BeregningsresultatDagligReise } from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export const lagVedtakstabellDagligReise = (
    beregningsresultat: BeregningsresultatDagligReise | undefined
): string => {
    return `<table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
                <thead>
                    <tr>
                        <th style="width: 110px; ${borderStylingCompact}">Periode</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">Beløp du har rett til</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">30-dagersbillett</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">7-dagersbillett</th>
                        <th style="width: 110px; word-wrap: break-word; ${borderStylingCompact}">Enkeltbillett</th>
                    </tr>
                </thead>
                <tbody>
                    ${lagRaderForVedtak(beregningsresultat)}
                </tbody>
            </table>`;
};

const visBillettInfo = (antall: number | undefined, pris: number | undefined): string => {
    if (!antall || !pris) {
        return 'x';
    }
    return `${antall} * ${pris} kr`;
};

const lagRaderForVedtak = (beregningsresultat?: BeregningsresultatDagligReise): string => {
    if (!beregningsresultat?.offentligTransport) return '';

    return beregningsresultat.offentligTransport.reiser
        .flatMap((reise) =>
            reise.perioder.map((periode) => {
                const { fom, tom, pris30dagersbillett, prisSyvdagersbillett, prisEnkeltbillett } =
                    periode.grunnlag;
                const beløp = periode.beløp;
                const billettdetaljer = periode.billettdetaljer ?? {};

                const samletBillettDetaljer: Record<string, number> = Array.isArray(billettdetaljer)
                    ? billettdetaljer.reduce<Record<string, number>>((acc, obj) => {
                          const key = Object.keys(obj)[0];
                          acc[key] = obj[key];
                          return acc;
                      }, {})
                    : billettdetaljer;

                const antall30DagerBillett = samletBillettDetaljer['TRETTIDAGERSBILLETT'];
                const antall7DagerBillett = samletBillettDetaljer['SYVDAGERSBILLETT'];
                const antallEnkeltBillett = samletBillettDetaljer['ENKELTBILLETT'];

                const datoperiode: Periode = { fom, tom };
                const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);
                return `<tr style="text-align: right;">
                         <td style="text-align: left; ${borderStylingCompact}">${datoperiodeString}</td>
                         <td style="${borderStyling}">${beløp} kr</td>
                         <td style="${borderStyling}">${visBillettInfo(antall30DagerBillett, pris30dagersbillett)}</td>
                         <td style="${borderStyling}">${visBillettInfo(antall7DagerBillett, prisSyvdagersbillett)}</td>
                         <td style="${borderStyling}">${visBillettInfo(antallEnkeltBillett, prisEnkeltbillett)}</td>
                     </tr>`;
            })
        )
        .join('');
};
