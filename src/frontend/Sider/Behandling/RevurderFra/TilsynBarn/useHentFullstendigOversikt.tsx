import { useCallback, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import {
    InnvilgelseBarnetilsyn,
    VedtakBarnetilsyn,
} from '../../../../typer/vedtak/vedtakTilsynBarn';

export const useHentFullstendigOversikt = (): {
    hentBeregningsresultat: (forrigeBehandlingId: string) => void;
    vedtakBarnetilsyn: Ressurs<VedtakBarnetilsyn>;
} => {
    const { request } = useApp();

    const [vedtakBarnetilsyn, setVedtakBarnetilsyn] =
        useState<Ressurs<VedtakBarnetilsyn>>(byggTomRessurs());

    const hentForrigeVedtakMedFullHistorikk = useCallback(
        (forrigeBehandlingId: string) => {
            request<InnvilgelseBarnetilsyn, null>(
                `/api/sak/vedtak/tilsyn-barn/fullstendig-oversikt/${forrigeBehandlingId}`
            ).then(setVedtakBarnetilsyn);
        },
        [request]
    );

    return {
        hentBeregningsresultat: hentForrigeVedtakMedFullHistorikk,
        vedtakBarnetilsyn: vedtakBarnetilsyn,
    };
};
