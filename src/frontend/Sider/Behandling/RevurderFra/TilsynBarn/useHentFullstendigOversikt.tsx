import { useCallback, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import { InnvilgelseBarnetilsyn } from '../../../../typer/vedtak/vedtakTilsynBarn';

export const useHentFullstendigOversikt = (): {
    hentBeregningsresultat: (forrigeBehandlingId: string) => void;
    innvilgelseBarnetilsyn: Ressurs<InnvilgelseBarnetilsyn>;
} => {
    const { request } = useApp();

    const [innvilgelseBarnetilsyn, setInnvilgelseBarnetilsyn] =
        useState<Ressurs<InnvilgelseBarnetilsyn>>(byggTomRessurs());

    const hentBeregningsresultat = useCallback(
        (forrigeBehandlingId: string) => {
            request<InnvilgelseBarnetilsyn, null>(
                `/api/sak/vedtak/tilsyn-barn/fullstendig-oversikt/${forrigeBehandlingId}`
            ).then(setInnvilgelseBarnetilsyn);
        },
        [request]
    );

    return {
        hentBeregningsresultat: hentBeregningsresultat,
        innvilgelseBarnetilsyn: innvilgelseBarnetilsyn,
    };
};
