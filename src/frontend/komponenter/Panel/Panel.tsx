import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading, HStack, Spacer } from '@navikt/ds-react';
import { BgAccentModerate, BgAccentSoft } from '@navikt/ds-tokens/darkside-js';

const Container = styled.div`
    background-color: ${BgAccentSoft};
`;

const Header = styled.div`
    background-color: ${BgAccentModerate};
    padding: 1rem;
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
