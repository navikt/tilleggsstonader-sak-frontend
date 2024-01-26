import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading } from '@navikt/ds-react';
import { ABlue100, ABlue50 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    background-color: ${ABlue50};
`;

const Header = styled.div`
    background-color: ${ABlue100};
    padding: 1rem 2rem;
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
    heading?: React.ReactNode;
    tittel?: string;
    children: React.ReactNode;
}

const EkspanderbartPanel: FC<Props> = ({ heading, tittel, children }) => {
    return (
        <Container>
            <Header>
                {tittel && <Heading size="small">{tittel}</Heading>}
                {heading}
            </Header>
            <Innhold>{children}</Innhold>
        </Container>
    );
};

export default EkspanderbartPanel;
