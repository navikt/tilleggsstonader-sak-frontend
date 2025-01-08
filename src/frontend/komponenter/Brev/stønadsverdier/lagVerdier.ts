import { preutfylleOpphørsDato } from './preutfylleOpphørsDato';
import { preutfylleVedtaksDatoer } from './preutfylleVedtaksDatoer';
import { Brevverdier } from './verdier';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { TypeVedtak, VedtakResponse } from '../../../typer/vedtak/vedtak';
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

    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN: {
            if (vedtak.type === TypeVedtak.INNVILGELSE) {
                const beregningsresultat =
                    vedtak.beregningsresultat as BeregningsresultatTilsynBarn;
                return preutfylleVedtaksDatoer(
                    beregningsresultat.gjelderFraOgMed,
                    beregningsresultat.gjelderTilOgMed
                );
            } else if (vedtak.type === TypeVedtak.OPPHØR) {
                return preutfylleOpphørsDato(behandling.revurderFra);
            } else {
                return TOMME_VERDIER;
            }
        }
        case Stønadstype.LÆREMIDLER: {
            if (vedtak.type === TypeVedtak.INNVILGELSE) {
                const innvilgelseLæremidler = vedtak as InnvilgelseLæremidler;
                return preutfylleVedtaksDatoer(
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
