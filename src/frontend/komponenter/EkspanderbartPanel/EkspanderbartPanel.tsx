import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading, HStack } from '@navikt/ds-react';
import { ABlue100, ABlue50 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    background-color: ${ABlue50};
`;

const Header = styled.div`
    background-color: ${ABlue100};
    padding: 1rem;
    display: flex;
    gap: 2rem;
    align-items: center;
`;

const Innhold = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Props {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    children: React.ReactNode;
}

const EkspanderbartPanel: FC<Props> = ({ ekstraHeading, tittel, ikon, children }) => {
    return (
        <Container>
            <Header>
                <HStack gap="2">
                    {ikon}
                    <Heading size="small">{tittel}</Heading>
                </HStack>
                {ekstraHeading}
            </Header>
            <Innhold>{children}</Innhold>
        </Container>
    );
};

export default EkspanderbartPanel;
