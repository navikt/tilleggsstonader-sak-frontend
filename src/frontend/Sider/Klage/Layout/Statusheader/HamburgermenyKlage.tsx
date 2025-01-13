import React from 'react';

import { Hamburgermeny, MenyItem } from '../../../../komponenter/Hamburgermeny/Hamburgermeny';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';

export const HamburgermenyKlage = () => {
    const { settVisHenleggModal } = useKlagebehandling();

    const menyItems: MenyItem[] = [
        {
            tekst: 'Henlegg',
            onClick: () => settVisHenleggModal((prevState) => !prevState),
        },
    ];

    return <Hamburgermeny items={menyItems} />;
};
