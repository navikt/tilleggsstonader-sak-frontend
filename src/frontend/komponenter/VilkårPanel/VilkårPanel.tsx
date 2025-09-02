import React from 'react';

import { RegelverkKontekstmeny } from './RegelverkKontekstmeny';
import { Lenke } from '../../Sider/Behandling/lenker';
import Panel from '../Panel/Panel';

interface VilkårpanelProps {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    paragraflenker?: Lenke[];
    rundskrivlenker?: Lenke[];
    forskriftlenker?: Lenke[];
    children: React.ReactNode;
}

export const VilkårPanel: React.FC<VilkårpanelProps> = ({
    tittel,
    ikon,
    ekstraHeading,
    paragraflenker,
    rundskrivlenker,
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
                    forskriftlenker={forskriftlenker}
                    rundskrivlenker={rundskrivlenker}
                />
            }
        >
            {children}
        </Panel>
    );
};
