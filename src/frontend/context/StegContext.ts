import constate from 'constate';

import { FanePath, FanerMedRouter, faneTilSteg } from '../Sider/Behandling/faner';
import { Behandling } from '../typer/behandling/behandling';

interface Props {
    fane: FanePath;
    behandling: Behandling;
    behandlingErRedigerbar: boolean;
    behandlingFaner: FanerMedRouter[];
}

export const [StegProvider, useSteg] = constate(
    ({ fane, behandling, behandlingErRedigerbar, behandlingFaner }: Props) => {
        const erISteg = behandling.steg === faneTilSteg[fane];
        const indeksForAktivFane = behandlingFaner.findIndex((faneInfo) => faneInfo.path === fane);
        const nesteFane = behandlingFaner.at(indeksForAktivFane + 1);
        const erStegRedigerbart = erISteg && behandlingErRedigerbar;

        return {
            erStegRedigerbart,
            nesteFanePath: nesteFane?.path,
        };
    }
);
