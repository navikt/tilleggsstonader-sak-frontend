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
                window.open(await genererModiaLenke());
            }}
            icon={<ExternalLinkIcon />}
        >
            Modia personoversikt
        </ActionMenu.Item>
    );
};
