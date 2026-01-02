import React, { SetStateAction } from 'react';

import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from '@navikt/aksel-icons';
import { Button, Heading, Panel, Textarea, TextField, Tooltip } from '@navikt/ds-react';

import styles from './Fritekst.module.css';
import { FritekstAvsnitt } from './typer';
import { SøppelbøtteKnapp } from '../Knapper/SøppelbøtteKnapp';

export const lagTomtAvsnitt = (): FritekstAvsnitt => ({ deloverskrift: '', innhold: '' });

interface Props {
    alleAvsnitt: FritekstAvsnitt[] | undefined;
    settAvsnitt: React.Dispatch<SetStateAction<FritekstAvsnitt[]>>;
}

const Fritekst: React.FC<Props> = ({ alleAvsnitt, settAvsnitt }) => {
    const oppdaterAvsnitt = (indeks: number, oppdatertAvsnitt: FritekstAvsnitt) =>
        settAvsnitt((prevState) =>
            prevState.map((avsnitt, i) => (i === indeks ? oppdatertAvsnitt : avsnitt))
        );

    const fjernAvsnitt = (indeks: number) =>
        settAvsnitt((prevState) => prevState.filter((_, i) => i !== indeks));

    const leggTilNyttAvsnitt = () =>
        settAvsnitt((prevState) =>
            alleAvsnitt ? [...prevState, lagTomtAvsnitt()] : [lagTomtAvsnitt()]
        );

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
        if (alleAvsnitt && indeks === alleAvsnitt.length - 1) return;

        settAvsnitt((prevState) => [
            ...prevState.slice(0, indeks),
            prevState[indeks + 1],
            prevState[indeks],
            ...prevState.slice(indeks + 2),
        ]);
    };

    return (
        <div className={styles.flexColumn}>
            <Heading size={'small'}>Fritekst</Heading>
            {alleAvsnitt &&
                alleAvsnitt.map((avsnitt, indeks) => {
                    return (
                        <Panel border className={styles.fritekstAvsnittContainer} key={indeks}>
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
                            <div className={styles.knappeWrapper}>
                                <Tooltip content="Slett avsnitt">
                                    <SøppelbøtteKnapp onClick={() => fjernAvsnitt(indeks)} />
                                </Tooltip>
                                <Tooltip content="Flytt avsnitt ned">
                                    <Button
                                        size={'small'}
                                        variant={'tertiary'}
                                        icon={<ArrowDownIcon />}
                                        onClick={() => flyttAvsnittNed(indeks)}
                                        disabled={
                                            indeks === alleAvsnitt.length - 1 ||
                                            alleAvsnitt.length === 1
                                        }
                                    />
                                </Tooltip>
                                <Tooltip content="Flytt avsnitt opp">
                                    <Button
                                        size={'small'}
                                        variant={'tertiary'}
                                        icon={<ArrowUpIcon />}
                                        onClick={() => flyttAvsnittOpp(indeks)}
                                        disabled={indeks === 0 && alleAvsnitt.length === 1}
                                    />
                                </Tooltip>
                            </div>
                        </Panel>
                    );
                })}
            <Button
                size="small"
                variant="secondary"
                icon={<PlusIcon fontSize="1.5rem" />}
                onClick={leggTilNyttAvsnitt}
                style={{ width: 'fit-content' }}
            >
                Legg til fritekst
            </Button>
        </div>
    );
};

export default Fritekst;
