import { formaterKrVerdiVedBekreftetSats } from './rammevedtakstabellUtils';
import { RammeForReiseMedPrivatBil } from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';

export function lagRammevedtakstabellUtenDelperioder(reise: RammeForReiseMedPrivatBil): string {
    const rader = lagRadData(reise);
    if (rader.length === 0) return '';
    // Sjekk om noen rader har bom/ferge for å vise kolonne
    const harBom = rader.some((rad) => rad.bompengerPerDag);
    const harFerge = rader.some((rad) => rad.fergekostnadPerDag);
    return `
    <table style="border-collapse:collapse;border:1px solid #b0b0b0;width:100%;margin:0;">
      <thead>
        <tr>
          <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:left;">Periode</th>
          <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:left;">Reiseavstand</th>
          <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:left;">Reisedager pr uke</th>
          <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Kilometersats</th>
          ${harBom ? '<th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Bompenger per dag</th>' : ''}
          ${harFerge ? '<th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Fergekostnader per dag</th>' : ''}
          <th style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.90em;font-weight:500;text-align:right;">Dagsats uten parkering</th>
        </tr>
      </thead>
      <tbody>
        ${rader
            .map(
                (rad) => `
          <tr>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${rad.periode}</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${rad.reiseavstand} km</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${rad.reisedagerPerUke} ${rad.reisedagerPerUke === 1 ? 'dag' : 'dager'}</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${rad.kilometersats}</td>
            ${harBom ? `<td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${rad.bompengerPerDag ? rad.bompengerPerDag + ' kr' : ''}</td>` : ''}
            ${harFerge ? `<td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${rad.fergekostnadPerDag ? rad.fergekostnadPerDag + ' kr' : ''}</td>` : ''}
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${rad.dagsatsUtenParkering}</td>
          </tr>
        `
            )
            .join('')}
      </tbody>
    </table>
    `;
}

function lagRadData(reise: RammeForReiseMedPrivatBil) {
    return reise.delperioder.flatMap((delperiode) =>
        delperiode.satser.map((sats) => ({
            periode: formaterIsoPeriodeMedTankestrek({
                fom: sats.fom,
                tom: sats.tom,
            }),
            reiseavstand: formaterTallMedTusenSkille(reise.reiseavstandEnVei),
            reisedagerPerUke: delperiode.reisedagerPerUke,
            kilometersats: formaterKrVerdiVedBekreftetSats(
                sats.kilometersats,
                sats.satsBekreftetVedVedtakstidspunkt
            ),
            bompengerPerDag: formaterTallMedTusenSkille(delperiode.bompengerPerDag),
            fergekostnadPerDag: formaterTallMedTusenSkille(delperiode.fergekostnadPerDag),
            dagsatsUtenParkering: formaterKrVerdiVedBekreftetSats(
                sats.dagsatsUtenParkering,
                sats.satsBekreftetVedVedtakstidspunkt
            ),
        }))
    );
}
