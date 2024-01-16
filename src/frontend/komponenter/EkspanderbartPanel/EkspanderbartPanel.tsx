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

const HeaderInnhold = styled.div`
    display: flex;
    gap: 1rem;
`;

const Innhold = styled.div`
    padding: 2rem;
`;

interface Props {
    tittel: string;
    headerInnhold?: React.ReactNode;
    children: React.ReactNode;
}

const EkspanderbartPanel: FC<Props> = ({ tittel, headerInnhold, children }) => {
    return (
        <Container>
            <Header>
                <Heading size="small">{tittel}</Heading>
                <HeaderInnhold>{headerInnhold}</HeaderInnhold>
                {/* TODO: Legg til knapp for å åpne og lukke panel */}
            </Header>
            <Innhold>{children}</Innhold>
        </Container>
    );
};

export default EkspanderbartPanel;
