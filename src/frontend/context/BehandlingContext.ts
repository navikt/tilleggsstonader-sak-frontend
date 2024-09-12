import { useFlag } from '@unleash/proxy-client-react';
import constate from 'constate';

import { useApp } from './AppContext';
import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingFakta } from '../typer/behandling/behandlingFakta/behandlingFakta';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';
import { Toggle } from '../utils/toggles';

interface Props {
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
}

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling, behandlingFakta }: Props) => {
        const { erSaksbehandler } = useApp();

        const kanSaksbehandle = useFlag(Toggle.KAN_SAKSBEHANDLE);

        const behandlingErRedigerbar =
            kanSaksbehandle && erBehandlingRedigerbar(behandling.status) && erSaksbehandler;
        return {
            behandling,
            behandlingErRedigerbar,
            hentBehandling,
            behandlingFakta,
        };
    }
);
