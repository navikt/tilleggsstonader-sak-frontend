import constate from 'constate';

import { FanePath, faneTilSteg } from '../Sider/Behandling/faner';
import { Behandling } from '../typer/behandling/behandling';

interface Props {
    fane: FanePath | undefined;
    behandling: Behandling;
    behandlingErRedigerbar: boolean;
}

export const [StegProvider, useSteg] = constate(
    ({ fane, behandling, behandlingErRedigerbar }: Props) => {
        const erISteg = fane && behandling.steg === faneTilSteg[fane];

        const erStegRedigerbart = erISteg && behandlingErRedigerbar;

        return {
            erStegRedigerbart,
        };
    }
);
