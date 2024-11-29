import React, { SetStateAction } from 'react';

import { PortableText } from '@portabletext/react';
import styled from 'styled-components';

import { ExpansionCard } from '@navikt/ds-react';
import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { DelmalMeny } from './DelmalMeny';
import { FritekstSerializer } from './Sanity/FritekstSerializer';
import { ValgfeltSerializer } from './Sanity/ValgfeltSerializer';
import { Delmal as DelmalType, Fritekst, FritekstAvsnitt, Valg, Valgfelt } from './typer';
import { VariabelSerializer } from './VariabelSerializer';

const Background = styled.div`
    --ac-expansioncard-bg: ${ABlue50};
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
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
`;

interface Props {
    delmal: DelmalType;
    valgfelt: Partial<Record<Valgfelt['_id'], Valg>>;
    settValgfelt: React.Dispatch<SetStateAction<Record<Valgfelt['_id'], Valg>>>;
    variabler: Partial<Record<string, string>>;
    settVariabler: React.Dispatch<SetStateAction<Partial<Record<string, string>>>>;
    fritekst: Record<string, FritekstAvsnitt[] | undefined>;
    settFritekst: React.Dispatch<SetStateAction<Record<string, FritekstAvsnitt[] | undefined>>>;
    inkluderIBrev: boolean;
    settInkluderIBrev: (inkluderIBrev: boolean) => void;
}

export const CustomComponets = (
    valgfelt: Partial<Record<string, Valg>>,
    variabler: Partial<Record<string, string>>,
    fritekst: Record<string, FritekstAvsnitt[] | undefined>
) => ({
    types: {
        fritekst: (props: { value: Fritekst }) =>
            FritekstSerializer({ avsnitt: fritekst[props.value.parentId] }),
        valgfelt: ValgfeltSerializer(valgfelt, variabler, fritekst),
    },
    marks: {
        variabel: VariabelSerializer(variabler),
    },
});

const Delmal: React.FC<Props> = ({
    delmal,
    valgfelt,
    settValgfelt,
    variabler,
    settVariabler,
    fritekst,
    settFritekst,
    inkluderIBrev,
    settInkluderIBrev,
}) => {
    return (
        <Background>
            <ExpansionCard
                aria-label={'Delmal'}
                size="small"
                defaultOpen={delmal.visningsdetaljer.skalAlltidMed}
            >
                <ExpansionCard.Header>
                    <ExpansionCard.Title size="small">{delmal.visningsnavn}</ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <Container>
                        <DelmalMeny
                            delmal={delmal}
                            valgfelt={valgfelt}
                            settValgfelt={settValgfelt}
                            variabler={variabler}
                            settVariabler={settVariabler}
                            fritekst={fritekst}
                            settFritekst={settFritekst}
                            inkluderIBrev={inkluderIBrev}
                            settInkluderIBrev={settInkluderIBrev}
                        />
                        <ExpansionCard aria-label={'Forhåndvis delmal'} size="small">
                            <ExpansionCard.Header>
                                <ExpansionCard.Title size="small">
                                    Generert brevtekst
                                </ExpansionCard.Title>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
                                <DelmalPreview>
                                    <Innhold>
                                        <PortableText
                                            value={delmal.blocks}
                                            components={CustomComponets(
                                                valgfelt,
                                                variabler,
                                                fritekst
                                            )}
                                        />
                                    </Innhold>
                                </DelmalPreview>
                            </ExpansionCard.Content>
                        </ExpansionCard>
                    </Container>
                </ExpansionCard.Content>
            </ExpansionCard>
        </Background>
    );
};

export default Delmal;
