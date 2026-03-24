import { RammevedtakPrivatBil } from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriodeMedTankestrek } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';

const borderStylingCompact = 'border: 1px solid black; padding: 3px 2px 3px 5px;';
const borderStyling = 'border: 1px solid black; padding: 3px 10px 3px 5px;';

export function lagRammevedtakstabellPrivatBil(
    rammevedtak: RammevedtakPrivatBil | undefined
): string {
    if (!rammevedtak) return '';

    const htmlPerReise = rammevedtak.reiser.map((reise) => {
        const fom = reise.fom;
        const tom = reise.tom;

        const datoperiode: Periode = { fom, tom };
        const datoperiodeString = formaterIsoPeriodeMedTankestrek(datoperiode);

        return `
        <p style="margin-bottom: 1px" >Reise med privat bil til <strong>${reise.aktivitetsadresse ?? '-'}</strong>:</p>
        <table style="margin-left: 2px; margin-right: 2px; border-collapse: collapse; ${borderStylingCompact}">
            <thead>
                <th style="width: 160px; ${borderStylingCompact}">Periode</th>
                <th style="width: 120px; ${borderStylingCompact}">Reisedager per uke</th>
                <th style="width: 100px; ${borderStylingCompact}">Reiseavstand én vei</th>
                <th style="width: 110px; ${borderStylingCompact}">Kilometersats</th>
                ${reise.bompengerPerDag ? `<th style="width: 110px; ${borderStylingCompact}">Bom per dag</th>` : ''}
                ${reise.fergekostnadPerDag ? `<th style="width: 110px; ${borderStylingCompact}">Ferge per dag</th>` : ''}
                <th style="width: 110px; ${borderStylingCompact}">Dagsats u/parkering</th>
            </thead>
            <tbody>
                <tr style="text-align: right;">
                    <td style="text-align: left; ${borderStylingCompact}">${datoperiodeString}</td>
                    <td style="${borderStyling}">${reise.reisedagerPerUke} ${reise.reisedagerPerUke > 1 ? 'dager' : 'dag'}</td>
                    <td style="${borderStyling}">${reise.reiseavstandEnVei} km</td>
                    <td style="${borderStyling}">${reise.kilometersats} kr</td>
                    ${reise.bompengerPerDag ? `<td style="${borderStyling}">${reise.bompengerPerDag} kr</td>` : ''}
                    ${reise.fergekostnadPerDag ? `<td style="${borderStyling}">${reise.fergekostnadPerDag ?? '-'}</td>` : ''}                    
                    <td style="${borderStyling}">${reise.dagsatsUtenParkering} kr</td>
                </tr>
            </tbody>
        </table>
    `;
    });
    return htmlPerReise.join('');
}
