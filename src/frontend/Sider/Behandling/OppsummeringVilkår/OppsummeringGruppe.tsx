import React from 'react';

import { HGrid, Label, VStack } from '@navikt/ds-react';

export const OppsummeringGruppe = ({
    tittel,
    children,
}: {
    tittel: string;
    children: React.ReactNode;
}) => {
    return (
        <HGrid columns={'125px auto'}>
            <Label size="small">{tittel}</Label>
            <VStack gap={'2'} align={'baseline'}>
                {children}
            </VStack>
        </HGrid>
    );
};
