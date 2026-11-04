import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { BeregningsresultatFlytting } from '../../../typer/vedtak/vedtakFlytting';
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
        case Stønadstype.FLYTTING_TSO:
        case Stønadstype.FLYTTING_TSR:
            return lagPunktlisteInnvilgedeDatoerForFlytting(
                vedtak.beregningsresultat as BeregningsresultatFlytting
            );
        default:
            return '';
    }
};

const lagPunktlisteHtml = (perioder: Periode[]): string => {
    const sortertePerioder = perioder.sort((a, b) => a.fom.localeCompare(b.fom));
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
        ...(beregningsresultat?.offentligTransport ?? []).filter(
            (periode) => !periode.fraTidligereVedtak
        ),
        ...(beregningsresultat?.privatBil ?? []).filter((periode) => !periode.fraTidligereVedtak),
        ...(beregningsresultat?.drosje ?? []).filter((periode) => !periode.fraTidligereVedtak),
    ];

    const unikePerioder = fjernDuplikater(perioder, erPerioderLike);

    return lagPunktlisteHtml(unikePerioder);
};

const erPerioderLike = (periodeA: Periode, periodeB: Periode) =>
    periodeA.fom === periodeB.fom && periodeA.tom === periodeB.tom;

function lagPunktlisteInnvilgedeDatoerForFlytting(
    beregningsresultat: BeregningsresultatFlytting
): string {
    const resultater = beregningsresultat.resultater
        .filter((resultat) => !resultat.fraTidligereVedtak)
        .sort((a, b) => a.fom.localeCompare(b.fom));

    return `<ul style="margin: 0; padding-top: 0">
    ${resultater
        .map((resultat) => `<li style="margin: 0;">${formaterTilTekstligDato(resultat.fom)}</li>`)
        .join('')}
    </ul>`;
}
