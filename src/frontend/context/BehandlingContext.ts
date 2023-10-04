import constate from 'constate';

import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Behandling } from '../typer/behandling/behandling';

interface Props {
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
}

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling }: Props) => {
        const behandlingErRedigerbar = true;

        return {
            behandling,
            behandlingErRedigerbar,
            hentBehandling,
        };
    }
);
