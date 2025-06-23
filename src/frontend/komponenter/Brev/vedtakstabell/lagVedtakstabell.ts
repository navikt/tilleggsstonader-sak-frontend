import { lagVedtakstabellBoutgifter } from './lagVedtakstabellBoutgifter';
import { lagVedtakstabellLæremidler } from './lagVedtakstabellLæremidler';
import { lagVedtakstabellTilsynBarn } from './lagVedtakstabellTilsynBarn';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { BeregningsresultatBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { BeregningsresultatLæremidler } from '../../../typer/vedtak/vedtakLæremidler';
import { BeregningsresultatTilsynBarn } from '../../../typer/vedtak/vedtakTilsynBarn';

export type LagVedtakstabell = Record<string, string>;

/**
 * Lager en vedtakstabell i html som vises i innvilgelsebrevet
 * @param behandling trengs for å vite hvilken stønadstype det er for å kunne typecaste
 */
export const lagVedtakstabell = (
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined
): string => {
    if (!behandling || !vedtak) {
        return '';
    }
    if (vedtak.type !== 'INNVILGELSE') {
        return '';
    }

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return lagVedtakstabellTilsynBarn(
                vedtak.beregningsresultat as BeregningsresultatTilsynBarn
            );
        case Stønadstype.LÆREMIDLER:
            return lagVedtakstabellLæremidler(
                vedtak.beregningsresultat as BeregningsresultatLæremidler
            );
        case Stønadstype.BOUTGIFTER:
            return lagVedtakstabellBoutgifter(
                vedtak.beregningsresultat as BeregningsresultatBoutgifter
            );
        default:
            return '';
    }
};
