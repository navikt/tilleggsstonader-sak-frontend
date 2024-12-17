import { lagVerdierVedtakFraOgTil } from './lagVerdierVedtakFraOgTil';
import { Brevverdier } from './verdier';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakResponse } from '../../../typer/vedtak/vedtak';
import { InnvilgelseLæremidler } from '../../../typer/vedtak/vedtakLæremidler';
import { BeregningsresultatTilsynBarn } from '../../../typer/vedtak/vedtakTilsynBarn';

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
        case Stønadstype.BARNETILSYN: {
            const beregningsresultat = vedtak.beregningsresultat as BeregningsresultatTilsynBarn;
            return lagVerdierVedtakFraOgTil(
                beregningsresultat.gjelderFraOgMed,
                beregningsresultat.gjelderTilOgMed
            );
        }
        case Stønadstype.LÆREMIDLER: {
            const innvilgelseLæremidler = vedtak as InnvilgelseLæremidler;
            return lagVerdierVedtakFraOgTil(
                innvilgelseLæremidler.gjelderFraOgMed,
                innvilgelseLæremidler.gjelderTilOgMed
            );
        }
        default:
            return TOMME_VERDIER;
    }
};
