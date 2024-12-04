import { useCallback, useState } from 'react';

import { Vedtaksperiode } from './VedtakshistorikkTilsynBarnTabellVisning';
import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';

export const useHentFullstendigOversikt = (): {
    hentFullstendigOversikt: (forrigeBehandlingId: string) => void;
    fullstendigOversikt: Ressurs<Vedtaksperiode[]>;
} => {
    const { request } = useApp();

    const [fullstendigOversikt, settFullstendigOversikt] =
        useState<Ressurs<Vedtaksperiode[]>>(byggTomRessurs());

    const hentFullstendigOversikt = useCallback(
        (forrigeBehandlingId: string) => {
            request<Vedtaksperiode[], null>(
                `/api/sak/vedtak/tilsyn-barn/fullstendig-oversikt/${forrigeBehandlingId}`
            ).then(settFullstendigOversikt);
        },
        [request]
    );

    return {
        hentFullstendigOversikt,
        fullstendigOversikt,
    };
};
