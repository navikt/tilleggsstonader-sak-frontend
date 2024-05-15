import constate from 'constate';

import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingFakta } from '../typer/behandling/behandlingFakta/behandlingFakta';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';

interface Props {
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
}

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling, behandlingFakta }: Props) => {
        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling);

        return {
            behandling,
            behandlingErRedigerbar,
            hentBehandling,
            behandlingFakta,
        };
    }
);
