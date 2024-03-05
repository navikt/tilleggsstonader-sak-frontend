import { useState } from 'react';

import constate from 'constate';

import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Behandling } from '../typer/behandling/behandling';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';

interface Props {
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
}

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling }: Props) => {
        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling);

        const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

        return {
            behandling,
            behandlingErRedigerbar,
            hentBehandling,
            statusPåVentRedigering,
            settStatusPåVentRedigering,
        };
    }
);
