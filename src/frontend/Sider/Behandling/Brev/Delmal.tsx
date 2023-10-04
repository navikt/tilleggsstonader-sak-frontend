import React from 'react';

import { PortableText } from '@portabletext/react';
import styled from 'styled-components';

import { ExpansionCard, Label, Switch } from '@navikt/ds-react';
import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import Fritekst from './Fritekst';
import { FritekstSerializer } from './Sanity/FritekstSerializer';
import { Delmal as DelmalType, Fritekst as FritekstType, Valgfelt as ValgfeltType } from './typer';
import Valgfelt from './Valgfelt';

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

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 640px;
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

const DelmalMeny: React.FC<{ delmal: DelmalType }> = ({ delmal }) => {
    return (
        <FlexColumn>
            <Switch>Inkluder seksjon i brev</Switch>
            {delmal.blocks
                .filter(
                    (val): val is ValgfeltType | FritekstType =>
                        val._type === 'valgfelt' || val._type == 'fritekst'
                )
                .map((val) =>
                    val._type === 'valgfelt' ? <Valgfelt valgfelt={val} /> : <Fritekst />
                )}
        </FlexColumn>
    );
};

// TODO: Denne, og komponentene den bruker er ikke ferdig
const CustomComponets = {
    types: {
        fritekst: () => FritekstSerializer({}),
        valgfelt: () => <div>Valgfelt</div>,
    },
    marks: {
        variabel: () => <span>Variabel</span>,
    },
};

const Delmal: React.FC<Props> = ({ delmal }) => {
    return (
        <Background>
            <ExpansionCard aria-label={'Delmal'}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title>{delmal.visningsnavn}</ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <Container>
                        <DelmalMeny delmal={delmal} />
                        <DelmalPreview>
                            <Label>Generert brevtekst</Label>
                            <Innhold>
                                <PortableText value={delmal.blocks} components={CustomComponets} />
                            </Innhold>
                        </DelmalPreview>
                    </Container>
                </ExpansionCard.Content>
            </ExpansionCard>
        </Background>
    );
};

export default Delmal;
