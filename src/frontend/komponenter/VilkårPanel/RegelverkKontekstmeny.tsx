import React from 'react';

import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

import { Lenke } from '../../Sider/Behandling/lenker';

export function RegelverkKontekstmeny({
    paragraflenker,
    forskriftlenker,
    rundskrivlenke,
}: {
    paragraflenker?: Lenke[];
    forskriftlenker?: Lenke[];
    rundskrivlenke?: Lenke[];
}) {
    const harLenker = paragraflenker?.length || forskriftlenker?.length || rundskrivlenke?.length;

    if (!harLenker) {
        return null;
    }

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button variant="tertiary" size="small" icon={<GavelSoundBlockIcon />}>
                    Regelverk
                </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <Gruppe tittel="Lovbestemmelser" lenker={paragraflenker} />
                <Gruppe tittel="Forskrifter" lenker={forskriftlenker} />
                <Gruppe tittel="Rundskriv" lenker={rundskrivlenke} />
            </ActionMenu.Content>
        </ActionMenu>
    );
}

function Gruppe({ tittel, lenker }: { tittel: string; lenker?: Lenke[] }) {
    if (!lenker?.length) {
        return null;
    }
    return (
        <>
            <ActionMenu.Group label={tittel}></ActionMenu.Group>
            {lenker.map((lenke, indeks) => (
                <ActionMenu.Item as={'a'} key={indeks} href={lenke.url} target="_blank">
                    {lenke.tekst}
                </ActionMenu.Item>
            ))}
        </>
    );
}
