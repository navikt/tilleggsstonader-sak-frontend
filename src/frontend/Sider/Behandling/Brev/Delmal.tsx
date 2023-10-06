import React, { useState } from 'react';

import { PortableText } from '@portabletext/react';
import styled from 'styled-components';

import { ExpansionCard, Label } from '@navikt/ds-react';
import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { DelmalMeny } from './DelmalMeny';
import { FritekstSerializer } from './Sanity/FritekstSerializer';
import { ValgfeltSerializer } from './Sanity/ValgfeltSerializer';
import { Delmal as DelmalType, Valg } from './typer';

const Background = styled.div`
    --ac-expansioncard-bg: ${ABlue50};
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`;

const Innhold = styled.div`
    background-color: white;
    padding: 1rem;
`;

const DelmalPreview = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1rem;
    max-width: 1080px;
`;

interface Props {
    delmal: DelmalType;
}

// TODO: Denne, og komponentene den bruker er ikke ferdig
const CustomComponets = (valgfelt: Record<string, Valg>, variabler: Record<string, string>) => ({
    types: {
        fritekst: () => FritekstSerializer({}),
        valgfelt: ValgfeltSerializer(valgfelt, variabler),
    },
    marks: {
        variabel: () => <span>Variabel</span>,
    },
});

const Delmal: React.FC<Props> = ({ delmal }) => {
    const [valgfelt, settValgfelt] = useState<Record<string, Valg>>({});
    const [variabler, settVariabler] = useState<Record<string, string>>({});

    return (
        <Background>
            <ExpansionCard aria-label={'Delmal'}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title>{delmal.visningsnavn}</ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <Container>
                        <DelmalMeny
                            delmal={delmal}
                            valgfelt={valgfelt}
                            settValgfelt={settValgfelt}
                            variabler={variabler}
                            settVariabler={settVariabler}
                        />
                        <DelmalPreview>
                            <Label>Generert brevtekst</Label>
                            <Innhold>
                                <PortableText
                                    value={delmal.blocks}
                                    components={CustomComponets(valgfelt, variabler)}
                                />
                            </Innhold>
                        </DelmalPreview>
                    </Container>
                </ExpansionCard.Content>
            </ExpansionCard>
        </Background>
    );
};

export default Delmal;
