import React from 'react';

import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

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
                <ActionMenu>
                    <ActionMenu.Trigger>
                        <Button
                            variant={'tertiary-neutral'}
                            size={'small'}
                            icon={<GavelSoundBlockIcon />}
                        >
                            Regelverk
                        </Button>
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                        <ActionMenu.Group label="Lovbestemmelser"></ActionMenu.Group>
                        {paragraflenker.map((lenke, indeks) => (
                            <ActionMenu.Item as={'a'} key={indeks} href={lenke.url} target="_blank">
                                {lenke.tekst}
                            </ActionMenu.Item>
                        ))}
                        <ActionMenu.Group label="Forskrifter"></ActionMenu.Group>
                        {forskriftlenker.map((lenke, indeks) => (
                            <ActionMenu.Item as={'a'} key={indeks} href={lenke.url} target="_blank">
                                {lenke.tekst}
                            </ActionMenu.Item>
                        ))}
                        <ActionMenu.Group label="Rundskriv"></ActionMenu.Group>
                        {rundskrivlenke.map((lenke, indeks) => (
                            <ActionMenu.Item as={'a'} key={indeks} href={lenke.url} target="_blank">
                                {lenke.tekst}
                            </ActionMenu.Item>
                        ))}
                    </ActionMenu.Content>
                </ActionMenu>
            }
        >
            {children}
        </Panel>
    );
};
