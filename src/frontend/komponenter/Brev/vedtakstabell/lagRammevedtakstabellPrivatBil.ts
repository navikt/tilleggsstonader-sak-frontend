import {
    RammeForReiseMedPrivatBilDelperiode,
    RammevedtakPrivatBil,
} from '../../../typer/vedtak/vedtakDagligReise';
import { formaterIsoPeriodeMedTankestrek, tilDato } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';

export function lagRammevedtakstabellPrivatBil(
    rammevedtak: RammevedtakPrivatBil | undefined
): string {
    if (!rammevedtak) return '';

    const htmlPerReise = rammevedtak.reiser.map((reise) => {
        const skalViseTabellMedDelperioder = reise.delperioder.length !== 1;

        const harUbekreftetSats = reise.delperioder.some((delperiode) =>
            delperiode.satser.some((sats) => !sats.satsBekreftetVedVedtakstidspunkt)
        );

        const årForUbekreftedeSatser = reise.delperioder
            .flatMap((delperiode) => delperiode.satser)
            .filter((sats) => !sats.satsBekreftetVedVedtakstidspunkt)
            .map((sats) => tilDato(sats.fom).getFullYear());

        const utledÅrForFørsteSatsjustering =
            årForUbekreftedeSatser.length > 0 ? Math.min(...årForUbekreftedeSatser) : undefined;

        const formaterPeriode = (fom: string, tom: string) => {
            const delperiodeDato: Periode = { fom, tom };
            return formaterIsoPeriodeMedTankestrek(delperiodeDato);
        };
        const visningsraderForDelperiode = (delperiode: RammeForReiseMedPrivatBilDelperiode) => {
            return delperiode.satser.map((sats) => {
                const visningsPeriode = formaterPeriode(sats.fom, sats.tom);
                const visningsKilometersats = !sats.satsBekreftetVedVedtakstidspunkt
                    ? sats.kilometersats + ' kr*'
                    : sats.kilometersats + ' kr';
                const visningsDagsats = !sats.satsBekreftetVedVedtakstidspunkt
                    ? sats.dagsatsUtenParkering + ' kr*'
                    : sats.dagsatsUtenParkering + ' kr';
                return {
                    periode: visningsPeriode,
                    reisedagerPerUke: delperiode.reisedagerPerUke,
                    kilometersats: visningsKilometersats,
                    dagsatsUtenParkering: visningsDagsats,
                    bompengerPerDag: delperiode.bompengerPerDag,
                    fergekostnadPerDag: delperiode.fergekostnadPerDag,
                };
            });
        };

        const delperioderTable = (delperioder: RammeForReiseMedPrivatBilDelperiode[]) => {
            if (!delperioder.length) return '';
            const visningsrader = delperioder.flatMap(visningsraderForDelperiode);
            const harBom = visningsrader.some((r) => r.bompengerPerDag);
            const harFerge = visningsrader.some((r) => r.fergekostnadPerDag);
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
                ${visningsrader
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
        };

        const tabellMedDelperioder = () => {
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
                <td style="border:1px solid #b0b0b0;padding:4px 8px;background:#fff;vertical-align:middle;text-align:left;">${formaterPeriode(reise.fom, reise.tom)}</td>
                <td style="border:1px solid #b0b0b0;padding:4px 8px;background:#fff;vertical-align:middle;text-align:left;">${reise.reiseavstandEnVei} km</td>
              </tr>
              <tr>
                <td colspan="2" style="border:1px solid #b0b0b0;padding:0;background:transparent;">${delperioderTable(reise.delperioder)}</td>
              </tr>
            </tbody>
            </table>
            `;
        };

        return `
        <p style="margin-bottom:2px;font-weight:500;">Reise med privat bil til <strong>${reise.aktivitetsadresse ?? '-'}</strong>:</p>
        ${skalViseTabellMedDelperioder ? tabellMedDelperioder() : lagFlatRammevedtakstabellPrivatBil(rammevedtak)}
        ${harUbekreftetSats && utledÅrForFørsteSatsjustering ? `<p>* Fra 1. januar ${utledÅrForFørsteSatsjustering} kan kilometersatsene for daglig reise med bil bli endret. Derfor kan beløpet du får utbetalt fra januar ${utledÅrForFørsteSatsjustering}, være et annet enn det som står i utbetalingsplanen.</p>` : ''}
        `;
    });
    return htmlPerReise.join('');
}

export function lagFlatRammevedtakstabellPrivatBil(
    rammevedtak: RammevedtakPrivatBil | undefined
): string {
    if (!rammevedtak) return '';
    const visningsrader = rammevedtak.reiser.flatMap((reise) =>
        reise.delperioder.flatMap((delperiode) =>
            delperiode.satser.map((sats) => ({
                periode: formaterIsoPeriodeMedTankestrek({
                    fom: sats.fom,
                    tom: sats.tom,
                }),
                reiseavstand: reise.reiseavstandEnVei,
                reisedagerPerUke: delperiode.reisedagerPerUke,
                kilometersats:
                    sats.kilometersats + (!sats.satsBekreftetVedVedtakstidspunkt ? ' kr*' : ' kr'),
                bompengerPerDag: delperiode.bompengerPerDag
                    ? delperiode.bompengerPerDag + ' kr'
                    : '',
                fergekostnadPerDag: delperiode.fergekostnadPerDag
                    ? delperiode.fergekostnadPerDag + ' kr'
                    : '',
                dagsatsUtenParkering:
                    sats.dagsatsUtenParkering +
                    (!sats.satsBekreftetVedVedtakstidspunkt ? ' kr*' : ' kr'),
            }))
        )
    );
    if (visningsrader.length === 0) return '';
    // Sjekk om noen rader har bom/ferge for å vise kolonne
    const harBom = visningsrader.some((r) => r.bompengerPerDag);
    const harFerge = visningsrader.some((r) => r.fergekostnadPerDag);
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
        ${visningsrader
            .map(
                (r) => `
          <tr>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${r.periode}</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${r.reiseavstand} km</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:left;">${r.reisedagerPerUke} ${r.reisedagerPerUke === 1 ? 'dag' : 'dager'}</td>
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${r.kilometersats}</td>
            ${harBom ? `<td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${r.bompengerPerDag}</td>` : ''}
            ${harFerge ? `<td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${r.fergekostnadPerDag}</td>` : ''}
            <td style="border:1px solid #b0b0b0;padding:4px 8px;font-size:0.95em;text-align:right;">${r.dagsatsUtenParkering}</td>
          </tr>
        `
            )
            .join('')}
      </tbody>
    </table>
    `;
}
