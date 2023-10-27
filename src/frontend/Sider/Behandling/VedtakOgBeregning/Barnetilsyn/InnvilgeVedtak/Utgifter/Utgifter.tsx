import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import UtgifterValg from './UtgifterValg';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../../hooks/felles/useRecordState';
import { Utgift } from '../../../../../../typer/vedtak';
import { Barn } from '../../../../vilkår';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

interface Props {
    errorState: FormErrors<Record<string, Utgift[]>>;
    utgifterState: RecordState<Utgift[]>;
    barnIBehandling: Barn[];
}

const Utgifter: React.FC<Props> = ({ utgifterState, barnIBehandling, errorState }) => {
    const oppdaterUtgift = (barnId: string, utgiftIndex: number, oppdatertUtgift: Utgift) => {
        const oppdaterteUtgifter = utgifterState.value[barnId].map((utgift, indeks) =>
            indeks === utgiftIndex ? oppdatertUtgift : utgift
        );

        utgifterState.update(barnId, oppdaterteUtgifter);
    };

    return (
        <div>
            <Heading spacing size="small" level="5">
                Dokumenterte utgifter
            </Heading>
            <Container>
                {barnIBehandling.map((barn) => (
                    <UtgifterValg
                        barn={barn}
                        utgifter={utgifterState.value[barn.barnId]}
                        errorState={errorState && errorState[barn.barnId]}
                        key={barn.barnId}
                        oppdaterUtgift={(utgiftIndeks: number, oppdatertUtgift: Utgift) =>
                            oppdaterUtgift(barn.barnId, utgiftIndeks, oppdatertUtgift)
                        }
                    />
                ))}
            </Container>
        </div>
    );
};

export default Utgifter;
