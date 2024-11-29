import React, { SetStateAction } from 'react';

import styled from 'styled-components';

import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button, Heading, Panel, Textarea, TextField, Tooltip } from '@navikt/ds-react';

import { FritekstAvsnitt } from './typer';
import { SøppelbøtteKnapp } from '../Knapper/SøppelbøtteKnapp';

const FritekstAvsnittContainer = styled(Panel).attrs({ border: true })`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const KnappeWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
`;

export const lagTomtAvsnitt = (): FritekstAvsnitt => ({ deloverskrift: '', innhold: '' });

interface Props {
    avsnitt: FritekstAvsnitt[];
    settAvsnitt: React.Dispatch<SetStateAction<FritekstAvsnitt[]>>;
}

const Fritekst: React.FC<Props> = ({ avsnitt, settAvsnitt }) => {
    const oppdaterAvsnitt = (indeks: number, oppdatertAvsnitt: FritekstAvsnitt) =>
        settAvsnitt((prevState) =>
            prevState.map((avsnitt, i) => (i === indeks ? oppdatertAvsnitt : avsnitt))
        );

    const fjernAvsnitt = (indeks: number) =>
        settAvsnitt((prevState) => prevState.filter((_, i) => i !== indeks));

    const leggTilNyttAvsnitt = () => settAvsnitt((prevState) => [...prevState, lagTomtAvsnitt()]);

    const flyttAvsnittOpp = (indeks: number) => {
        if (indeks === 0) return;

        settAvsnitt((prevState) => [
            ...prevState.slice(0, indeks - 1),
            prevState[indeks],
            prevState[indeks - 1],
            ...prevState.slice(indeks + 1),
        ]);
    };

    const flyttAvsnittNed = (indeks: number) => {
        if (indeks === avsnitt.length - 1) return;

        settAvsnitt((prevState) => [
            ...prevState.slice(0, indeks),
            prevState[indeks + 1],
            prevState[indeks],
            ...prevState.slice(indeks + 2),
        ]);
    };

    return (
        <FlexColumn>
            <Heading size={'small'}>Fritekst</Heading>
            {avsnitt.map((avsnitt, indeks) => {
                return (
                    <FritekstAvsnittContainer key={indeks}>
                        <TextField
                            size={'small'}
                            value={avsnitt.deloverskrift}
                            label={'Deloverskrift'}
                            onChange={(e) =>
                                oppdaterAvsnitt(indeks, {
                                    deloverskrift: e.target.value,
                                    innhold: avsnitt.innhold,
                                })
                            }
                            autoComplete="off"
                        />
                        <Textarea
                            label={'Innhold'}
                            size={'small'}
                            value={avsnitt.innhold}
                            onChange={(e) =>
                                oppdaterAvsnitt(indeks, {
                                    deloverskrift: avsnitt.deloverskrift,
                                    innhold: e.target.value,
                                })
                            }
                        />
                        <KnappeWrapper>
                            <Tooltip content="Slett avsnitt">
                                <SøppelbøtteKnapp onClick={() => fjernAvsnitt(indeks)} />
                            </Tooltip>
                            <Tooltip content="Flytt avsnitt ned">
                                <Button
                                    size={'small'}
                                    variant={'tertiary'}
                                    icon={<ArrowDownIcon />}
                                    onClick={() => flyttAvsnittNed(indeks)}
                                />
                            </Tooltip>
                            <Tooltip content="Flytt avsnitt opp">
                                <Button
                                    size={'small'}
                                    variant={'tertiary'}
                                    icon={<ArrowUpIcon />}
                                    onClick={() => flyttAvsnittOpp(indeks)}
                                />
                            </Tooltip>
                        </KnappeWrapper>
                    </FritekstAvsnittContainer>
                );
            })}
            <Button
                size={'small'}
                variant={'secondary'}
                icon={<PlusIcon fontSize="1.5rem" />}
                onClick={leggTilNyttAvsnitt}
            >
                Legg til fritekst
            </Button>
        </FlexColumn>
    );
};

export default Fritekst;
