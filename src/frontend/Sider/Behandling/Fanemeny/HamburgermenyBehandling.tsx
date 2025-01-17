import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { useBehandling } from '../../../context/BehandlingContext';
import {
    Hamburgermeny,
    MenuGroup,
    MenuItem,
} from '../../../komponenter/Hamburgermeny/Hamburgermeny';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { Steg } from '../../../typer/behandling/steg';
import { Toggle } from '../../../utils/toggles';

export const HamburgermenyBehandling = () => {
    const { behandling, settVisRedigerGrunnlagFomAdmin, behandlingErRedigerbar } = useBehandling();
    const kanRedigereGrunnlagFom = useFlag(Toggle.KAN_REDIGERE_GRUNNLAG_FOM);
    const groups: MenuGroup[] = [];
    const behandlingItems: MenuItem[] = [];
    if (
        behandling.type === BehandlingType.FØRSTEGANGSBEHANDLING &&
        behandling.steg === Steg.INNGANGSVILKÅR &&
        kanRedigereGrunnlagFom
    ) {
        behandlingItems.push({
            tekst: 'Rediger dato saksopplysninger hentes fra',
            onSelect: () => settVisRedigerGrunnlagFomAdmin(true),
        });
    }

    if (behandlingItems.length > 0) {
        groups.push({
            tekst: 'Behandling',
            items: behandlingItems,
        });
    }

    if (!behandlingErRedigerbar) {
        return null;
    }

    return <Hamburgermeny groups={groups} />;
};
