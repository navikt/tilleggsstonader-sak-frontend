import { formaterKrVerdiVedBekreftetSats } from './rammevedtakstabellUtils';
import {
    RammeForReiseMedPrivatBil,
    RammeForReiseMedPrivatBilDelperiode,
} from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';

export function lagRammevedtakstabellMedDelperioder(reise: RammeForReiseMedPrivatBil): string {
    return `
            <table style="border-collapse:collapse;border:1px solid #b0b0b0;width:100%;background:#fff;margin-bottom:12px;">
              <thead>
                <tr>
                  <th style="width:120px;border:1px solid #b0b0b0;padding:4px 8px;background:#f5f5f5;font-weight:600;text-align:left;vertical-align:middle;">Periode for reisen</th>
                  <th style="width:90px;border:1px solid #b0b0b0;padding:4px 8px;background:#f5f5f5;font-weight:600;text-align:left;vertical-align:middle;">Reiseavstand</th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border:1px solid #b0b0b0;padding:4px 8px;background:#fff;vertical-align:middle;text-align:left;">${formaterIsoPeriodeMedTankestrek({ fom: reise.fom, tom: reise.tom })}</td>
                <td style="border:1px solid #b0b0b0;padding:4px 8px;background:#fff;vertical-align:middle;text-align:left;">${reise.reiseavstandEnVei} km</td>
              </tr>
              <tr>
                <td colspan="2" style="border:1px solid #b0b0b0;padding:0;background:transparent;">${lagDelperiodeTabell(reise.delperioder)}</td>
              </tr>
            </tbody>
            </table>
            `;
}

function lagDelperiodeTabell(delperioder: RammeForReiseMedPrivatBilDelperiode[]): string {
    if (!delperioder.length) return '';
    const rader = delperioder.flatMap(lagRadData);
    const harBom = rader.some((rad) => rad.bompengerPerDag);
    const harFerge = rader.some((rad) => rad.fergekostnadPerDag);
    const periodeWidth = harBom && harFerge ? '120px' : '194px';

    return `
            <table style="border-collapse:collapse;border:1px solid #b0b0b0;width:100%;background:#fafbfc;margin:0;">
              <thead>
                <tr>
                  <th style="width:120px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#f0f4f8;font-weight:500;text-align:left;vertical-align:middle;white-space:nowrap;">Delperiode</th>
                  <th style="width:60px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#f0f4f8;font-weight:500;text-align:left;vertical-align:middle;white-space:nowrap;">Reisedager pr uke</th>
                  <th style="width:60px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#f0f4f8;font-weight:500;text-align:right;vertical-align:middle;white-space:nowrap;">Kilometersats</th>
                  ${harBom ? `<th style="width:80px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#f0f4f8;font-weight:500;text-align:right;vertical-align:middle;white-space:nowrap;">Bompenger per dag</th>` : ''}
                  ${harFerge ? `<th style="width:80px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#f0f4f8;font-weight:500;text-align:right;vertical-align:middle;white-space:nowrap;">Fergekostnader per dag</th>` : ''}
                  <th style="min-width:80px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#f0f4f8;font-weight:500;text-align:right;vertical-align:middle;white-space:nowrap;">Dagsats uten parkering</th>
                </tr>
              </thead>
              <tbody>
                ${rader
                    .map(
                        (r) => `
                  <tr>
                    <td style="width:${periodeWidth};border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#fafbfc;vertical-align:middle;text-align:left;white-space:normal;">${r.periode}</td>
                    <td style="width:60px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#fafbfc;vertical-align:middle;text-align:left;white-space:nowrap;">
                      ${r.reisedagerPerUke} ${r.reisedagerPerUke === 1 ? 'dag' : 'dager'}
                    </td>
                    <td style="width:60px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#fafbfc;vertical-align:middle;text-align:right;white-space:nowrap;">${r.kilometersats}</td>
                    ${harBom ? `<td style="width:80px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#fafbfc;vertical-align:middle;text-align:right;white-space:nowrap;">${r.bompengerPerDag ? r.bompengerPerDag + ' kr' : ''}</td>` : ''}
                    ${harFerge ? `<td style="width:80px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#fafbfc;vertical-align:middle;text-align:right;white-space:nowrap;">${r.fergekostnadPerDag ? r.fergekostnadPerDag + ' kr' : ''}</td>` : ''}
                    <td style="min-width:80px;border:1px solid #b0b0b0;padding:2px 4px;font-size:0.90em;background:#fafbfc;vertical-align:middle;text-align:right;white-space:nowrap;">${r.dagsatsUtenParkering}</td>
                  </tr>
                `
                    )
                    .join('')}
              </tbody>
            </table>
            `;
}

function lagRadData(delperiode: RammeForReiseMedPrivatBilDelperiode) {
    return delperiode.satser.map((sats) => ({
        periode: formaterIsoPeriodeMedTankestrek({ fom: sats.fom, tom: sats.tom }),
        reisedagerPerUke: delperiode.reisedagerPerUke,
        kilometersats: formaterKrVerdiVedBekreftetSats(
            sats.kilometersats,
            sats.satsBekreftetVedVedtakstidspunkt
        ),
        dagsatsUtenParkering: formaterKrVerdiVedBekreftetSats(
            sats.dagsatsUtenParkering,
            sats.satsBekreftetVedVedtakstidspunkt
        ),
        bompengerPerDag: formaterTallMedTusenSkille(delperiode.bompengerPerDag),
        fergekostnadPerDag: formaterTallMedTusenSkille(delperiode.fergekostnadPerDag),
    }));
}
