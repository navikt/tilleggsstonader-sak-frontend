import React from 'react';

import { HStack, Heading, VStack } from '@navikt/ds-react';

export const InfoSeksjon: React.FC<{
    label: string;
    ikon: React.ReactNode;
    children?: React.ReactNode;
}> = ({ label, ikon, children }) => {
    return (
        <VStack gap="space-8">
            <HStack gap="space-8" align="center" wrap={false}>
                <div style={{ height: '18px' }}>{ikon}</div>
                <Heading level={'4'} size={'xsmall'}>
                    {label}
                </Heading>
            </HStack>
            {children}
        </VStack>
    );
};
