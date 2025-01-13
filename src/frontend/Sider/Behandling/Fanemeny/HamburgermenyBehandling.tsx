import React from 'react';

import { useBehandling } from '../../../context/BehandlingContext';
import { Hamburgermeny, MenyItem } from '../../../komponenter/Hamburgermeny/Hamburgermeny';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { Steg } from '../../../typer/behandling/steg';

export const HamburgermenyBehandling = () => {
    const { behandling, settVisRedigerGrunnlagFomAdmin } = useBehandling();

    const items: MenyItem[] = [
        ...(behandling.type === BehandlingType.FØRSTEGANGSBEHANDLING &&
        behandling.steg === Steg.INNGANGSVILKÅR
            ? [
                  {
                      tekst: 'Rediger dato saksopplysninger hentes fra',
                      onClick: () => settVisRedigerGrunnlagFomAdmin(true),
                  },
              ]
            : []),
    ];

    return <Hamburgermeny items={items} />;
};
