import React from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { ActionMenu } from '@navikt/ds-react';

import { useGenererModiaLenke } from './useGenererModiaLenke';

export const ModiaPersonoversiktLenke = ({ ident }: { ident: string }) => {
    const { genererModiaLenke } = useGenererModiaLenke(ident);
    return (
        <ActionMenu.Item
            onSelect={async (e) => {
                e.preventDefault();
                try {
                    const url = await genererModiaLenke();
                    window.open(url);
                } catch {
                    alert('Feilet generering av lenke til modia. Prøv på nytt.');
                }
            }}
            icon={<ExternalLinkIcon />}
        >
            Modia personoversikt
        </ActionMenu.Item>
    );
};
