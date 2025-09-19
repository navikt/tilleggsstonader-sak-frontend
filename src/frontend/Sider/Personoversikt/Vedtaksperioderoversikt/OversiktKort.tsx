import React from 'react';

import styled from 'styled-components';

import { Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { BgDefault, BorderNeutral } from '@navikt/ds-tokens/darkside-js';

const Container = styled(VStack)`
    border: 1px solid ${BorderNeutral};
    border-radius: 4px;
    padding: 1rem;
    background-color: ${BgDefault};
    width: 1200px;
`;

interface Props {
    tittel: string;
    tagTittel?: string;
    tagVariant?: 'info' | 'alt2';
    children: React.ReactNode;
}

export const OversiktKort: React.FC<Props> = ({ tittel, tagTittel, tagVariant, children }) => {
    return (
        <Container gap={'6'}>
            <HStack justify={'space-between'}>
                <Heading size={'small'}>{tittel}</Heading>
                <Tag size={'small'} variant={tagVariant ? tagVariant : 'alt2'}>
                    {tagTittel ? tagTittel : 'TS - Sak'}
                </Tag>
            </HStack>
            {children}
        </Container>
    );
};
