import constate from 'constate';

import { FanePath, faneTilSteg } from '../Sider/Behandling/faner';
import { Behandling } from '../typer/behandling/behandling';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';

interface Props {
    fane: FanePath | undefined;
    behandling: Behandling;
}

export const [StegProvider, useSteg] = constate(({ fane, behandling }: Props) => {
    const erISteg = fane && behandling.steg === faneTilSteg[fane];
    const erStegRedigerbart = erISteg && erBehandlingRedigerbar(behandling);

    return {
        erStegRedigerbart,
    };
});
