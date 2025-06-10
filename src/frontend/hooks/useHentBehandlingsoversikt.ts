import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Behandlingsoversikt } from '../typer/behandling/behandlingoversikt';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

export const useHentBehandlingsoversikt = (): {
    hentBehandlingsoversikt: (fagsakPersonId: string) => void;
    behandlingsoversikt: Ressurs<Behandlingsoversikt>;
} => {
    const { request } = useApp();

    const [behandlingsoversikt, settBehandlingsoversikt] =
        useState<Ressurs<Behandlingsoversikt>>(byggTomRessurs());

    const hentBehandlingsoversikt = useCallback(
        (fagsakPersonId: string) => {
            settBehandlingsoversikt(byggHenterRessurs());
            request<Behandlingsoversikt, null>(
                `/api/sak/behandling/fagsak-person/${fagsakPersonId}`
            ).then(settBehandlingsoversikt);
        },
        [request]
    );

    return {
        hentBehandlingsoversikt,
        behandlingsoversikt,
    };
};
