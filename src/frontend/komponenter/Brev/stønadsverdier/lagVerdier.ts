import { preutfylleOpphørsDato } from './preutfylleOpphørsDato';
import { preutfylleVedtaksDatoer } from './preutfylleVedtaksDatoer';
import { Brevverdier } from './verdier';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { TypeVedtak, VedtakResponse } from '../../../typer/vedtak/vedtak';
import { InnvilgelseLæremidler } from '../../../typer/vedtak/vedtakLæremidler';
import {
    BeregningsresultatTilsynBarn,
    InnvilgelseBarnetilsyn,
} from '../../../typer/vedtak/vedtakTilsynBarn';

const TOMME_VERDIER: Brevverdier = { variabelStore: {} };

function behandleInnvilgelse(
    behandling: Behandling,
    vedtak: InnvilgelseBarnetilsyn | InnvilgelseLæremidler
) {
    if (behandling.stønadstype === Stønadstype.LÆREMIDLER) {
        const innvilgelseLæremidler = vedtak as InnvilgelseLæremidler;
        return preutfylleVedtaksDatoer(
            innvilgelseLæremidler.gjelderFraOgMed,
            innvilgelseLæremidler.gjelderTilOgMed
        );
    } else if (behandling.stønadstype === Stønadstype.BARNETILSYN) {
        const beregningsresultat = vedtak.beregningsresultat as BeregningsresultatTilsynBarn;
        return preutfylleVedtaksDatoer(
            beregningsresultat.gjelderFraOgMed,
            beregningsresultat.gjelderTilOgMed
        );
    } else {
        return TOMME_VERDIER;
    }
}

export const lagVerdier = (
    behandling: Behandling | undefined,
    vedtak: VedtakResponse | undefined
): Brevverdier => {
    if (!behandling || !vedtak) {
        return TOMME_VERDIER;
    }

    switch (vedtak.type) {
        case TypeVedtak.OPPHØR: {
            return preutfylleOpphørsDato(behandling.revurderFra);
        }
        case TypeVedtak.INNVILGELSE: {
            return behandleInnvilgelse(behandling, vedtak);
        }
        default:
            return TOMME_VERDIER;
    }
};
