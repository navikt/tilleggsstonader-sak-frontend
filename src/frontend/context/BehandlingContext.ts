import constate from 'constate';

import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { KlageBehandling } from '../typer/behandling/klageBehandling';
import { BehandlingFakta } from '../typer/behandling/behandlingFakta/behandlingFakta';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';

interface Props {
    behandling: KlageBehandling;
    hentBehandling: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
}

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling, behandlingFakta }: Props) => {
        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling.status);

        return {
            behandling,
            behandlingErRedigerbar,
            hentBehandling,
            behandlingFakta,
        };
    }
);
