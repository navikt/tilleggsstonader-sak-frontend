import React from 'react';

import { BodyShort, HStack, Link } from '@navikt/ds-react';

import { Lenke } from '../../Sider/Behandling/lenker';
import Panel from '../Panel/Panel';

interface VilkårpanelProps {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    paragraflenker: Lenke[];
    rundskrivlenke: string;
    children: React.ReactNode;
}

export const VilkårPanel: React.FC<VilkårpanelProps> = ({
    tittel,
    ikon,
    ekstraHeading,
    paragraflenker,
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
                        paragrafLenker={paragraflenker}
                        rundskrivLenke={rundskrivlenke}
                    />
                </>
            }
        >
            {children}
        </Panel>
    );
};
const ParagrafOgRundskrivLenker: React.FC<{
    paragrafLenker: Lenke[];
    rundskrivLenke: string;
}> = ({ paragrafLenker, rundskrivLenke }) => {
    return (
        <HStack gap="4">
            <BodyShort>
                {paragrafLenker.map((lenke, indeks) => (
                    <React.Fragment key={indeks}>
                        <Link key={indeks} href={lenke.url}>
                            {lenke.tekst}
                        </Link>
                        {indeks !== paragrafLenker.length - 1 && ', '}
                    </React.Fragment>
                ))}
            </BodyShort>
            <Link href={rundskrivLenke}>Rundskriv</Link>
        </HStack>
    );
};
