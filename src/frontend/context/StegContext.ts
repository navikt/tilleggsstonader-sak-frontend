import constate from 'constate';

import { FanePath } from '../Sider/Behandling/faner';
import { Behandling } from '../typer/behandling/behandling';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';
import { Steg } from '../typer/behandling/steg';

const faneTilSteg: Record<FanePath, Steg> = {
    inngangsvilkar: Steg.INNGANGSVILKÅR,
    stonadsvilkar: Steg.VILKÅR,
    'vedtak-og-beregning': Steg.BEREGNE_YTELSE,
    simulering: Steg.SEND_TIL_BESLUTTER,
    brev: Steg.SEND_TIL_BESLUTTER,
};

interface Props {
    fane: FanePath | undefined;
    behandling: Behandling;
}

export const [StegProvider, useSteg] = constate(({ fane, behandling }: Props) => {
    const erStegRedigerbar = fane && behandling.steg === faneTilSteg[fane];
    const stegErRedigerbar = erStegRedigerbar && erBehandlingRedigerbar(behandling);

    return {
        stegErRedigerbar,
    };
});
