import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading, HStack, Spacer } from '@navikt/ds-react';
import { BgDefault, BorderNeutral } from '@navikt/ds-tokens/darkside-js';

const Container = styled.div`
    background-color: ${BgDefault};
    border: 1px solid ${BorderNeutral};
    border-radius: 12px;
`;

const Header = styled.div`
    border-bottom: 1px solid ${BorderNeutral};
    padding: 0.5rem 1rem;
    display: flex;
    gap: 2rem;
    align-items: center;
`;

const Innhold = styled.div`
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Props {
    tittel: string;
    ikon?: React.ReactNode;
    ekstraHeading?: React.ReactNode;
    children: React.ReactNode;
    kontekstmeny?: React.ReactNode;
}

const Panel: FC<Props> = ({ ekstraHeading, tittel, ikon, children, kontekstmeny }) => {
    return (
        <Container>
            <Header>
                <HStack gap="2" align="center">
                    {ikon}
                    <Heading size="small">{tittel}</Heading>
                </HStack>
                {ekstraHeading}
                <Spacer />
                {kontekstmeny}
            </Header>
            <Innhold>{children}</Innhold>
        </Container>
    );
};

export default Panel;
