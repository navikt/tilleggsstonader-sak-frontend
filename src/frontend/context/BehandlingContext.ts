import constate from 'constate';

import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Behandling } from '../typer/behandling/behandling';

export const [BehandlingProvider, useBehandling] = constate(
    (props: { behandling: Behandling; hentBehandling: RerrunnableEffect }) => props
);
