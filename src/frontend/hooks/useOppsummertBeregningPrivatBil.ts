import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { PrivatBilOppsummertBeregning } from '../Sider/Behandling/VedtakOgBeregning/DagligReise/typer';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentOppsummertBeregning: () => void;
    oppsummertBeregningResponse: Ressurs<PrivatBilOppsummertBeregning>;
}

export const useOppsummertBeregningPrivatBil = (): Response => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [oppsummertBeregningResponse, settOppsummertBeregningResponse] =
        useState<Ressurs<PrivatBilOppsummertBeregning>>(byggTomRessurs());

    const hentOppsummertBeregning = useCallback(() => {
        request<PrivatBilOppsummertBeregning, null>(
            `/api/sak/vedtak/daglig-reise/${behandling.id}/privat-bil/oppsummer-beregning`
        ).then(settOppsummertBeregningResponse);
    }, [behandling, request]);

    useEffect(() => {
        hentOppsummertBeregning();
    }, [hentOppsummertBeregning]);

    return {
        hentOppsummertBeregning,
        oppsummertBeregningResponse,
    };
};
