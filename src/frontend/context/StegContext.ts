import constate from 'constate';

import { FanePath, faneTilSteg } from '../Sider/Behandling/faner';
import { KlageBehandling } from '../typer/behandling/klageBehandling';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';

interface Props {
    fane: FanePath | undefined;
    behandling: KlageBehandling;
}

export const [StegProvider, useSteg] = constate(({ fane, behandling }: Props) => {
    const erISteg = fane && behandling.steg === faneTilSteg[fane];
    const erStegRedigerbart = erISteg && erBehandlingRedigerbar(behandling.status);

    return {
        erStegRedigerbart,
    };
});
