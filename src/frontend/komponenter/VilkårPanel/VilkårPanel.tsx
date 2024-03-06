import React from 'react';

import { Lenke } from '../../Sider/Behandling/lenker';
import Panel from '../Panel/Panel';
import { ParagrafOgRundskrivLenker } from '../ParagrafOgRundskrivLenker';

interface VilkårpanelProps {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    lovverkslenker: Lenke[];
    rundskrivlenke: string;
    children: React.ReactNode;
}

export const VilkårPanel: React.FC<VilkårpanelProps> = ({
    tittel,
    ikon,
    ekstraHeading,
    lovverkslenker,
    rundskrivlenke,
    children,
}) => {
    return (
        <Panel
            tittel={tittel}
            ikon={ikon}
            ekstraHeading={
                <>
                    {ekstraHeading}
                    <ParagrafOgRundskrivLenker
                        paragrafLenker={lovverkslenker}
                        rundskrivLenke={rundskrivlenke}
                    />
                </>
            }
        >
            {children}
        </Panel>
    );
};
