import React from 'react';

import styled from 'styled-components';

import { Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { ABgDefault, ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

const Container = styled(VStack)`
    border: 1px solid ${ABorderDefault};
    border-radius: 4px;
    padding: 1rem;
    background-color: ${ABgDefault};
    width: 1020px;
`;

interface Props {
    tittel: string;
    children: React.ReactNode;
}

export const OversiktKort: React.FC<Props> = ({ tittel, children }) => {
    return (
        <Container gap={'6'}>
            <HStack justify={'space-between'}>
                <Heading size={'small'}>{tittel}</Heading>
                <Tag size={'small'} variant="alt2">
                    TS-Sak
                </Tag>
            </HStack>
            {children}
        </Container>
    );
};
