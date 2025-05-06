import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { BehandlingOppsummering } from '../typer/behandling/behandlingOppsummering';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    behandlingOppsummering: Ressurs<BehandlingOppsummering>;
}

export const useBehandlingOppsummering = (): Response => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [behandlingOppsummering, settBehandlingOppsummering] =
        useState<Ressurs<BehandlingOppsummering>>(byggTomRessurs());

    useEffect(() => {
        settBehandlingOppsummering(byggHenterRessurs());

        request<BehandlingOppsummering, null>(
            `/api/sak/behandlingsoppsummering/${behandling.id}`
        ).then(settBehandlingOppsummering);
    }, [request, behandling.id, behandling.steg, behandling.revurderFra]);

    return {
        behandlingOppsummering,
    };
};
