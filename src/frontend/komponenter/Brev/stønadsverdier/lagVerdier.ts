import { mapRevurderFraDatoForPreutfyllingIBrevfanen } from './mapRevurderFraDatoForPreutfyllingIBrevfanen';
import { mapVedtaksDatoerForPreutfyllingIBrevfanen } from './mapVedtaksDatoerForPreutfyllingIBrevfanen';
import { Brevverdier } from './verdier';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { TypeVedtak, VedtakResponse } from '../../../typer/vedtak/vedtak';
import { InnvilgelseBoutgifter } from '../../../typer/vedtak/vedtakBoutgifter';
import { InnvilgelseLæremidler } from '../../../typer/vedtak/vedtakLæremidler';
import {
    BeregningsresultatTilsynBarn,
    InnvilgelseBarnetilsyn,
} from '../../../typer/vedtak/vedtakTilsynBarn';

const TOMME_VERDIER: Brevverdier = { variabelStore: {} };

function behandleInnvilgelse(
    behandling: Behandling,
    vedtak: InnvilgelseBarnetilsyn | InnvilgelseLæremidler | InnvilgelseBoutgifter
) {
    switch (behandling.stønadstype) {
        case Stønadstype.LÆREMIDLER: {
            const innvilgelseLæremidler = vedtak as InnvilgelseLæremidler;
            return mapVedtaksDatoerForPreutfyllingIBrevfanen(
                innvilgelseLæremidler.gjelderFraOgMed,
                innvilgelseLæremidler.gjelderTilOgMed
            );
        }

        case Stønadstype.BARNETILSYN: {
            const innvilgelseBarnetilsyn =
                vedtak.beregningsresultat as BeregningsresultatTilsynBarn;
            return mapVedtaksDatoerForPreutfyllingIBrevfanen(
                innvilgelseBarnetilsyn.gjelderFraOgMed,
                innvilgelseBarnetilsyn.gjelderTilOgMed
            );
        }

        case Stønadstype.BOUTGIFTER: {
            const innvilgelseBoutgifter = vedtak as InnvilgelseBoutgifter;
            return mapVedtaksDatoerForPreutfyllingIBrevfanen(
                innvilgelseBoutgifter.gjelderFraOgMed,
                innvilgelseBoutgifter.gjelderTilOgMed
            );
        }

        default:
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
            return mapRevurderFraDatoForPreutfyllingIBrevfanen(behandling.revurderFra);
        }
        case TypeVedtak.INNVILGELSE: {
            return behandleInnvilgelse(behandling, vedtak);
        }
        default:
            return TOMME_VERDIER;
    }
};
