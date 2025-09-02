import React from 'react';

import { GavelSoundBlockIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

import { Lenke } from '../../Sider/Behandling/lenker';

export function RegelverkKontekstmeny({
    paragraflenker,
    forskriftlenker,
    rundskrivlenker,
}: {
    paragraflenker?: Lenke[];
    forskriftlenker?: Lenke[];
    rundskrivlenker?: Lenke[];
}) {
    const harLenker = paragraflenker?.length || forskriftlenker?.length || rundskrivlenker?.length;

    if (!harLenker) {
        return null;
    }

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button variant="tertiary" size="xsmall" icon={<GavelSoundBlockIcon />}>
                    Regelverk
                </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <LenkeGruppe tittel="Lovbestemmelser" lenker={paragraflenker} />
                <LenkeGruppe tittel="Forskrifter" lenker={forskriftlenker} />
                <LenkeGruppe tittel="Rundskriv" lenker={rundskrivlenker} />
            </ActionMenu.Content>
        </ActionMenu>
    );
}

function LenkeGruppe({ tittel, lenker }: { tittel: string; lenker?: Lenke[] }) {
    if (!lenker?.length) {
        return null;
    }
    return (
        <ActionMenu.Group label={tittel}>
            {lenker.map((lenke, indeks) => (
                <ActionMenu.Item as={'a'} key={indeks} href={lenke.url} target="_blank">
                    {lenke.tekst}
                </ActionMenu.Item>
            ))}
        </ActionMenu.Group>
    );
}
