import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { formaterTilTekstligDato } from '../../../utils/dato';

export const lagInnvilgetPerioderPunktliste = (
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined
): string => {
    if (!vedtak) {
        return '';
    }
    if (vedtak.type !== 'INNVILGELSE') {
        return '';
    }

    switch (behandling?.stønadstype) {
        case Stønadstype.BOUTGIFTER:
            return lagPunktlisteInnvilgetPerioderForBoutgifter(
                vedtak.beregningsresultat as BeregningsresultatBoutgifter
            );
        default:
            return '';
    }
};

const lagPunktlisteInnvilgetPerioderForBoutgifter = (
    beregningsresultat: BeregningsresultatBoutgifter
): string => {
    return `<ul style="margin: 0; padding-top: 0">
    ${beregningsresultat.perioder
        .map((periode) =>
            periode.utgifterTilUtbetaling
                .filter((utgift) => !utgift.erFørRevurderFra)
                .map(
                    (utgift) =>
                        `<li style="margin: 0;">fra og med ${formaterTilTekstligDato(utgift.fom)} til og med ${formaterTilTekstligDato(utgift.tom)}</li>`
                )
        )
        .join('')}
    </ul>`;
};
