import { useCallback, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { BeregningsresultatTilsynBarn } from '../../../../typer/vedtak/vedtakTilsynBarn';

export const useHentFullstendigOversikt = (): {
    hentBeregningsresultat: (forrigeBehandlingId: string) => void;
    beregningsresultat: Ressurs<BeregningsresultatTilsynBarn>;
} => {
    const { request } = useApp();

    const [beregningsresultat, settBeregningsresultat] =
        useState<Ressurs<BeregningsresultatTilsynBarn>>(byggTomRessurs());

    const hentBeregningsresultat = useCallback(
        (forrigeBehandlingId: string) => {
            request<BeregningsresultatTilsynBarn, null>(
                `/api/sak/vedtak/tilsyn-barn/fullstendig-oversikt/${forrigeBehandlingId}`
            ).then(settBeregningsresultat);
        },
        [request]
    );

    return {
        hentBeregningsresultat: hentBeregningsresultat,
        beregningsresultat,
    };
};
