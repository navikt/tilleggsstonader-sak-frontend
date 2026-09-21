import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { BeregningResultatReiseTilSamling } from '../../../typer/vedtak/vedtakReiseTilSamling';
import { formaterTilTekstligDato } from '../../../utils/dato';
import { Periode } from '../../../utils/periode';

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
    return `<ul style="margin: 0; padding-top: 0">
    ${perioder
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
 * fjerner samlinger med identisk fom/tom og sorterer synkende på fom (nyeste først).
 */
const lagPunktlisteInnvilgedePerioderForReiseTilSamling = (
    beregningsresultat: BeregningResultatReiseTilSamling | undefined
): string => {
    const perioder = [
        ...(beregningsresultat?.offentligTransport ?? []),
        ...(beregningsresultat?.privatBil ?? []),
    ];

    const unikePerioder = fjernDuplikatePerioder(perioder);
    const sortertePerioder = unikePerioder.sort((a, b) => b.fom.localeCompare(a.fom));

    return lagPunktlisteHtml(sortertePerioder);
};

const fjernDuplikatePerioder = <T extends Periode>(perioder: T[]): T[] => {
    const unikePerioder = new Map<string, T>();
    perioder.forEach((periode) => {
        unikePerioder.set(`${periode.fom}_${periode.tom}`, periode);
    });
    return Array.from(unikePerioder.values());
};
