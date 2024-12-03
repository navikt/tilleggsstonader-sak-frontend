import { useCallback, useState } from 'react';

import { Vedtaksperiode } from './VedtakshistorikkTilsynBarnTabellVisning';
import { useApp } from '../../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';

export const useHentFullstendigOversikt = (): {
    hentFullstendigOversikt: (behandlingId: string) => void;
    fullstendigOversikt: Ressurs<Vedtaksperiode[]>;
} => {
    const { request } = useApp();

    const [fullstendigOversikt, settFullstendigOversikt] =
        useState<Ressurs<Vedtaksperiode[]>>(byggTomRessurs());

    const hentFullstendigOversikt = useCallback(
        (behandlingId: string) => {
            request<Vedtaksperiode[], null>(
                `/api/api/vedtak/tilsyn-barn/fullstendig-oversikt${behandlingId}`
            ).then(settFullstendigOversikt);
        },
        [request]
    );

    return {
        hentFullstendigOversikt,
        fullstendigOversikt,
    };
};
