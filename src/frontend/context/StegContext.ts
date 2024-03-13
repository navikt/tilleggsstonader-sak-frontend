import constate from 'constate';

import { FanePath } from '../Sider/Behandling/faner';
import { Behandling } from '../typer/behandling/behandling';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';
import { Steg } from '../typer/behandling/steg';

const faneTilSteg: Record<FanePath, Steg> = {
    [FanePath.INNGANGSVILKÅR]: Steg.INNGANGSVILKÅR,
    [FanePath.STØNADSVILKÅR]: Steg.VILKÅR,
    [FanePath.VEDTAK_OG_BEREGNING]: Steg.BEREGNE_YTELSE,
    [FanePath.SIMULERING]: Steg.SEND_TIL_BESLUTTER,
    [FanePath.BREV]: Steg.SEND_TIL_BESLUTTER,
};

interface Props {
    fane: FanePath;
    behandling: Behandling;
}

export const [StegProvider, useSteg] = constate(({ fane, behandling }: Props) => {
    const erStegRedigerbar = behandling.steg === faneTilSteg[fane];
    const erStegOgBehandlingRedigerbar = erStegRedigerbar && erBehandlingRedigerbar(behandling);

    return {
        erStegRedigerbar,
        erStegOgBehandlingRedigerbar,
    };
});
