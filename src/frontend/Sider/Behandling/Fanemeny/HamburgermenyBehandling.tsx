import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { Hamburgermeny, MenyItem } from '../../../komponenter/Hamburgermeny/Hamburgermeny';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { Steg } from '../../../typer/behandling/steg';
import { Toggle } from '../../../utils/toggles';

export const HamburgermenyBehandling = () => {
    const { behandling, settVisRedigerGrunnlagFomAdmin, behandlingErRedigerbar } = useBehandling();
    const kanRedigereGrunnlagFom = useFlag(Toggle.KAN_REDIGERE_GRUNNLAG_FOM);

    const items: MenyItem[] = [
        ...(behandling.type === BehandlingType.FØRSTEGANGSBEHANDLING &&
        behandling.steg === Steg.INNGANGSVILKÅR &&
        kanRedigereGrunnlagFom
            ? [
                  {
                      tekst: 'Rediger dato saksopplysninger hentes fra',
                      onClick: () => settVisRedigerGrunnlagFomAdmin(true),
                  },
              ]
            : []),
    ];

    if (!behandlingErRedigerbar) {
        return null;
    }

    return <Hamburgermeny items={items} />;
};
