import { lagVerdierTilsynBarn } from './lagVerdierTilsynBarn';
import { Brevverdier } from './verdier';
import { Behandling } from '../../../../typer/behandling/behandling';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../../typer/vedtak/vedtak';

const TOMME_VERDIER: Brevverdier = { variabelStore: {} };

export const lagVerdier = (
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined
): Brevverdier => {
    if (!behandling || !vedtak) {
        return TOMME_VERDIER;
    }
    if (vedtak.type !== 'INNVILGELSE') {
        return TOMME_VERDIER;
    }

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return lagVerdierTilsynBarn(vedtak.beregningsresultat);
        default:
            return TOMME_VERDIER;
    }
};
