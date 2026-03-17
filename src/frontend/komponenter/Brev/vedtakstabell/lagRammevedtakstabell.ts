import { lagRammevedtakstabellPrivatBil } from './lagRammevedtakstabellPrivatBil';
import { Behandling } from '../../../typer/behandling/behandling';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VedtakDagligReise } from '../../../typer/vedtak/vedtakDagligReise';

/**
 * Lager en rammevedtakstabell i html som vises i innvilgelsebrevet
 * @param behandling trengs for å vite hvilken stønadstype det er for å kunne typecaste
 */
export const lagRammevedtakstabell = (
    behandling: Behandling | undefined,
    vedtak: VedtakDagligReise | undefined
): string => {
    if (!behandling || !vedtak) {
        return '';
    }
    if (vedtak.type !== 'INNVILGELSE') {
        return '';
    }

    switch (behandling.stønadstype) {
        case Stønadstype.DAGLIG_REISE_TSO:
            return lagRammevedtakstabellPrivatBil(vedtak.rammevedtakPrivatBil);
        case Stønadstype.DAGLIG_REISE_TSR:
            return lagRammevedtakstabellPrivatBil(vedtak.rammevedtakPrivatBil);
        default:
            return '';
    }
};
