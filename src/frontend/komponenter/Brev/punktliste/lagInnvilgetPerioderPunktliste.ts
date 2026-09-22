import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { BeregningResultatReiseTilSamling } from '../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterTilTekstligDato } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';
import { fjernDuplikater } from '../../../utils/utils';

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
            return lagPunktlisteInnvilgedePerioderForBoutgifter(
                vedtak.beregningsresultat as BeregningsresultatBoutgifter
            );
        case Stønadstype.REISE_TIL_SAMLING_TSO:
        case Stønadstype.REISE_TIL_SAMLING_TSR:
            return lagPunktlisteInnvilgedePerioderForReiseTilSamling(
                vedtak.beregningsresultat as BeregningResultatReiseTilSamling | undefined
            );
        default:
            return '';
    }
};

const lagPunktlisteHtml = (perioder: Periode[]): string => {
    const sortertePerioder = perioder.sort((a, b) => b.fom.localeCompare(a.fom));
    return `<ul style="margin: 0; padding-top: 0">
    ${sortertePerioder
        .map(
            (periode) =>
                `<li style="margin: 0;">fra og med ${formaterTilTekstligDato(periode.fom)} til og med ${formaterTilTekstligDato(periode.tom)}</li>`
        )
        .join('')}
    </ul>`;
};

const lagPunktlisteInnvilgedePerioderForBoutgifter = (
    beregningsresultat: BeregningsresultatBoutgifter
): string => {
    const perioder = beregningsresultat.perioder.flatMap((periode) =>
        periode.utgifter.filter((utgift) => !utgift.erFørTidligsteEndring)
    );
    return lagPunktlisteHtml(perioder);
};

/**
 * Slår sammen offentlig transport og privat bil til én liste med samlinger,
 * og fjerner samlinger med identisk fom/tom. lagPunktlisteHtml sorterer perioder.
 */
const lagPunktlisteInnvilgedePerioderForReiseTilSamling = (
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string => {
    const perioder = [
        ...(beregningsresultat?.offentligTransport ?? []),
        ...(beregningsresultat?.privatBil ?? []),
    ];

    const unikePerioder = fjernDuplikater(perioder, erPerioderLike);

    return lagPunktlisteHtml(unikePerioder);
};

const erPerioderLike = (periodeA: Periode, periodeB: Periode) =>
    periodeA.fom === periodeB.fom && periodeA.tom === periodeB.tom;
