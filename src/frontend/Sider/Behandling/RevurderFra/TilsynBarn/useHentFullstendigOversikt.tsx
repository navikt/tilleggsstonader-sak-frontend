import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import {
    InnvilgelseBarnetilsyn,
    VedtakBarnetilsyn,
} from '../../../../typer/vedtak/vedtakTilsynBarn';

export const useHentFullstendigOversikt = (
    forrigeBehandlingId: string
): {
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
    useEffect(() => {
        hentForrigeVedtakMedFullHistorikk(forrigeBehandlingId);
    }, [forrigeBehandlingId, hentForrigeVedtakMedFullHistorikk]);

    return {
        vedtakBarnetilsyn: vedtakBarnetilsyn,
    };
};
