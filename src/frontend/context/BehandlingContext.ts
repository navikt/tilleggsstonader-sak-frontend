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

        // kanSetteBehandlingPåVent er temporær kan fjernes og erstattes med behandlingErRedigerbar når KAN_SAKSBEHANDLE fjernes
        const kanBehandleRevurdering = !behandling.forrigeBehandlingId || kanSaksbehandle;
        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling.status) && erSaksbehandler;

        return {
            behandling,
            behandlingErRedigerbar: kanBehandleRevurdering && behandlingErRedigerbar,
            hentBehandling,
            behandlingFakta,
            toggleKanSaksbehandle: kanSaksbehandle,
            kanSetteBehandlingPåVent: behandlingErRedigerbar,
        };
    }
);
