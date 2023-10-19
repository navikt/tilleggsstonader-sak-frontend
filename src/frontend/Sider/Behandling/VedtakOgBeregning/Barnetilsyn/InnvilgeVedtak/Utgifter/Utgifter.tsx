import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import UtgifterValg from './UtgifterValg';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../../hooks/felles/useRecordState';
import { Utgift } from '../../../../../../typer/vedtak';
import { Barn } from '../../../../vilkår';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

interface Props {
    errorState: FormErrors<Record<string, Utgift[]>>;
    utgifterState: RecordState<Utgift[]>;
    barnIBehandling: Barn[];
}

const Utgifter: React.FC<Props> = ({ utgifterState, barnIBehandling, errorState }) => {
    return (
        <Container>
            <Heading spacing size="small" level="5">
                Dokumenterte utgifter
            </Heading>
            {barnIBehandling.map((barn) => (
                <UtgifterValg
                    barn={barn}
                    utgifter={utgifterState.value[barn.barnId]}
                    errorState={errorState && errorState[barn.barnId]}
                />
            ))}
        </Container>
    );
};

export default Utgifter;
