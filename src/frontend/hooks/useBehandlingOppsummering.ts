import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { BehandlingOppsummering } from '../typer/behandling/behandlingOppsummering';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    behandlingOppsummering: Ressurs<BehandlingOppsummering>;
    hentBehandlingOppsummering: () => void;
}

export const useBehandlingOppsummering = (behandlingId: string): Response => {
    const { request } = useApp();
    const [behandlingOppsummering, settBehandlingOppsummering] =
        useState<Ressurs<BehandlingOppsummering>>(byggTomRessurs());

    const hentBehandlingOppsummering = useCallback(() => {
        settBehandlingOppsummering(byggHenterRessurs());
        request<BehandlingOppsummering, null>(
            `/api/sak/behandlingsoppsummering/${behandlingId}`
        ).then(settBehandlingOppsummering);
    }, [request, behandlingId]);

    return {
        behandlingOppsummering,
        hentBehandlingOppsummering,
    };
};
