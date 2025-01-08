import { lagVerdierVedtakFraOgTil } from './lagVerdierVedtakFraOgTil';
import { preutfylleOpphørsDato } from './preutfylleOpphørsDato';
import { Brevverdier } from './verdier';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { TypeVedtak, VedtakResponse } from '../../../typer/vedtak/vedtak';
import { InnvilgelseLæremidler } from '../../../typer/vedtak/vedtakLæremidler';
import { InnvilgelseBarnetilsyn } from '../../../typer/vedtak/vedtakTilsynBarn';

const TOMME_VERDIER: Brevverdier = { variabelStore: {} };

export const lagVerdier = (
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined
): Brevverdier => {
    if (!behandling || !vedtak) {
        return TOMME_VERDIER;
    }

    function preutfylleVedtaksDatoer(vedtak: InnvilgelseBarnetilsyn) {
        const beregningsresultat = vedtak.beregningsresultat;
        return lagVerdierVedtakFraOgTil(
            beregningsresultat.gjelderFraOgMed,
            beregningsresultat.gjelderTilOgMed
        );
    }

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN: {
            if (vedtak.type === TypeVedtak.INNVILGELSE) {
                return preutfylleVedtaksDatoer(vedtak as InnvilgelseBarnetilsyn);
            } else if (vedtak.type === TypeVedtak.OPPHØR) {
                return preutfylleOpphørsDato(behandling.revurderFra);
            } else {
                return TOMME_VERDIER;
            }
        }
        case Stønadstype.LÆREMIDLER: {
            if (vedtak.type === TypeVedtak.INNVILGELSE) {
                const innvilgelseLæremidler = vedtak as InnvilgelseLæremidler;
                return lagVerdierVedtakFraOgTil(
                    innvilgelseLæremidler.gjelderFraOgMed,
                    innvilgelseLæremidler.gjelderTilOgMed
                );
            } else if (vedtak.type === TypeVedtak.OPPHØR) {
                return preutfylleOpphørsDato(behandling.revurderFra);
            } else {
                return TOMME_VERDIER;
            }
        }
        default:
            return TOMME_VERDIER;
    }
};
