import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading } from '@navikt/ds-react';
import { ABlue100, ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { VilkårsresultatIkon } from './Ikoner/Vilkårsresultat/VilkårsresultatIkon';
import { Vilkårsresultat } from '../Sider/Behandling/vilkår';

const Container = styled.div`
    background-color: ${ABlue50};
`;

const Header = styled.div`
    background-color: ${ABlue100};
    padding: 1rem;
    display: grid;
    grid-template-columns: 21px 1fr 21px;
    gap: 1rem;
    align-items: center;
`;

const Innhold = styled.div`
    padding: 2rem;
`;

interface Props {
    tittel: string;
    resultat: Vilkårsresultat;
    children: React.ReactNode;
}

const EkspanderbartPanel: FC<Props> = ({ tittel, resultat, children }) => {
    return (
        <Container>
            <Header>
                <VilkårsresultatIkon vilkårsresultat={resultat} />
                <Heading size="medium">{tittel}</Heading>
                {/* TODO: Legg til knapp for å åpne og lukke panel */}
            </Header>
            <Innhold>{children}</Innhold>
        </Container>
    );
};

export default EkspanderbartPanel;
