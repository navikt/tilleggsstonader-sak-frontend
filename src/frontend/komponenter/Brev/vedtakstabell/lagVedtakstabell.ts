import { lagVedtakstabellTilsynBarn } from './lagVedtakstabellTilsynBarn';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';

export type LagVedtakstabell = Record<string, string>;

const TOM_VEDTAKSTABELL = {};

/**
 * Lager en vedtakstabell i html som vises i innvilgelsebrevet
 * @param behandling trengs for å vite hvilken stønadstype det er for å kunne typecaste
 */
export const lagVedtakstabell = (
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined
): LagVedtakstabell => {
    if (!behandling || !vedtak) {
        return TOM_VEDTAKSTABELL;
    }
    if (vedtak.type !== 'INNVILGELSE') {
        return TOM_VEDTAKSTABELL;
    }

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return lagVedtakstabellTilsynBarn(vedtak.beregningsresultat);
        default:
            return TOM_VEDTAKSTABELL;
    }
};
