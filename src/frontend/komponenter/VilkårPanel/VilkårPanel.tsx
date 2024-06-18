import React from 'react';

import { BodyShort, Detail, HStack, Link } from '@navikt/ds-react';

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
            ekstraHeading={
                <>
                    {ekstraHeading}
                    <ParagrafOgRundskrivLenker
                        paragrafLenker={paragraflenker}
                        rundskrivLenke={rundskrivlenke}
                        forskriftlenker={forskriftlenker}
                    />
                </>
            }
        >
            {children}
        </Panel>
    );
};

export const ParagrafOgRundskrivLenker: React.FC<{
    paragrafLenker: Lenke[];
    rundskrivLenke: Lenke[];
    forskriftlenker: Lenke[];
}> = ({ paragrafLenker, rundskrivLenke, forskriftlenker }) => {
    return (
        <HStack gap="4">
            <HStack gap="2">
                {paragrafLenker.map((lenke, indeks) => (
                    <BodyShort key={indeks} size={'small'}>
                        <Link key={indeks} href={lenke.url} target="_blank" variant="neutral">
                            {lenke.tekst}
                        </Link>
                    </BodyShort>
                ))}
            </HStack>
            {rundskrivLenke.length > 0 && (
                <HStack gap="2">
                    <Detail>Rundskriv til:</Detail>
                    {rundskrivLenke.map((lenke, indeks) => (
                        <BodyShort key={indeks} size={'small'}>
                            <Link key={indeks} href={lenke.url} target="_blank" variant="neutral">
                                {lenke.tekst}
                            </Link>
                        </BodyShort>
                    ))}
                </HStack>
            )}
            <HStack gap="2">
                {forskriftlenker.map((lenke, indeks) => (
                    <BodyShort key={indeks} size={'small'}>
                        <Link key={indeks} href={lenke.url} target="_blank" variant="neutral">
                            {lenke.tekst}
                        </Link>
                    </BodyShort>
                ))}
            </HStack>
        </HStack>
    );
};
