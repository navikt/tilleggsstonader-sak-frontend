import React from 'react';

import {
    Hamburgermeny,
    henleggMenuItem,
    MenuGroup,
} from '../../../../komponenter/Hamburgermeny/Hamburgermeny';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import {
    erBehandlingRedigerbar,
    Klagebehandling,
} from '../../typer/klagebehandling/klagebehandling';

export const HamburgermenyKlage = ({ behandling }: { behandling: Klagebehandling }) => {
    const { settVisHenleggModal } = useKlagebehandling();

    const groups: MenuGroup[] = [];
    if (erBehandlingRedigerbar(behandling)) {
        groups.push({
            tekst: 'Behandling',
            items: [henleggMenuItem(() => settVisHenleggModal((prevState) => !prevState))],
        });
    }

    return <Hamburgermeny groups={groups} />;
};
