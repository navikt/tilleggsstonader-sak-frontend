import { useCallback, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { BeregningsresultatTilsynBarn } from '../../../../typer/vedtak/vedtakTilsynBarn';

export const useHentFullstendigOversikt = (): {
    hentBeregningsresultat: (forrigeBehandlingId: string) => void;
    beregningsresultatRessurs: Ressurs<BeregningsresultatTilsynBarn>;
} => {
    const { request } = useApp();

    const [beregningsresultatRessurs, settBeregningsresultatRessurs] =
        useState<Ressurs<BeregningsresultatTilsynBarn>>(byggTomRessurs());

    const hentBeregningsresultat = useCallback(
        (forrigeBehandlingId: string) => {
            request<BeregningsresultatTilsynBarn, null>(
                `/api/sak/vedtak/tilsyn-barn/fullstendig-oversikt/${forrigeBehandlingId}`
            ).then(settBeregningsresultatRessurs);
        },
        [request]
    );

    return {
        hentBeregningsresultat: hentBeregningsresultat,
        beregningsresultatRessurs: beregningsresultatRessurs,
    };
};
