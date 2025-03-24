import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';
import {
    InnvilgelseBarnetilsyn,
    VedtakBarnetilsyn,
} from '../../../../typer/vedtak/vedtakTilsynBarn';

export const useHentFullstendigOversikt = (
    forrigeIverksatteBehandlingId: string
): {
    vedtakBarnetilsyn: Ressurs<VedtakBarnetilsyn>;
} => {
    const { request } = useApp();

    const [vedtakBarnetilsyn, setVedtakBarnetilsyn] =
        useState<Ressurs<VedtakBarnetilsyn>>(byggTomRessurs());

    const hentForrigeVedtakMedFullHistorikk = useCallback(
        (forrigeIverksatteBehandlingId: string) => {
            request<InnvilgelseBarnetilsyn, null>(
                `/api/sak/vedtak/tilsyn-barn/fullstendig-oversikt/${forrigeIverksatteBehandlingId}`
            ).then(setVedtakBarnetilsyn);
        },
        [request]
    );
    useEffect(() => {
        hentForrigeVedtakMedFullHistorikk(forrigeIverksatteBehandlingId);
    }, [forrigeIverksatteBehandlingId, hentForrigeVedtakMedFullHistorikk]);

    return {
        vedtakBarnetilsyn: vedtakBarnetilsyn,
    };
};
