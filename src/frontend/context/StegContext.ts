import constate from 'constate';

import { FanePath, faneTilSteg } from '../Sider/Behandling/faner';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingType } from '../typer/behandling/behandlingType';

interface Props {
    fane: FanePath;
    behandling: Behandling;
    behandlingErRedigerbar: boolean;
}

export const [StegProvider, useSteg] = constate(
    ({ fane, behandling, behandlingErRedigerbar }: Props) => {
        const erISteg = behandling.steg === faneTilSteg[fane];

        const revurderFraDatoMangler =
            behandling.type === BehandlingType.REVURDERING && !behandling.revurderFra;

        const erStegRedigerbart = erISteg && behandlingErRedigerbar && !revurderFraDatoMangler;

        return {
            erStegRedigerbart,
        };
    }
);
