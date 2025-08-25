import React from 'react';

import { RegelverkKontekstmeny } from './RegelverkKontekstmeny';
import { Lenke } from '../../Sider/Behandling/lenker';
import Panel from '../Panel/Panel';

interface VilkårpanelProps {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    paragraflenker: Lenke[];
    rundskrivlenke: Lenke[];
    forskriftlenker: Lenke[];
    children: React.ReactNode;
}

export const VilkårPanel: React.FC<VilkårpanelProps> = ({
    tittel,
    ikon,
    ekstraHeading,
    paragraflenker,
    rundskrivlenke,
    forskriftlenker,
    children,
}) => {
    return (
        <Panel
            tittel={tittel}
            ikon={ikon}
            ekstraHeading={ekstraHeading}
            kontekstmeny={
                <RegelverkKontekstmeny
                    paragraflenker={paragraflenker}
                    rundskrivlenke={forskriftlenker}
                    forskriftlenker={rundskrivlenke}
                />
            }
        >
            {children}
        </Panel>
    );
};
