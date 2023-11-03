import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import UtgifterValg from './UtgifterValg';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../../hooks/felles/useRecordState';
import { Utgift } from '../../../../../../typer/vedtak';
import { GrunnlagBarn } from '../../../../vilkår';
import { InnvilgeVedtakForm } from '../InnvilgeBarnetilsyn';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

interface Props {
    errorState: FormErrors<Record<string, Utgift[]>>;
    utgifterState: RecordState<Utgift[]>;
    barnIBehandling: GrunnlagBarn[];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const Utgifter: React.FC<Props> = ({
    utgifterState,
    barnIBehandling,
    errorState,
    settValideringsFeil,
}) => {
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
                        oppdaterUtgiter={(utgifter: Utgift[]) =>
                            utgifterState.update(barn.barnId, utgifter)
                        }
                        settValideringsFeil={settValideringsFeil}
                    />
                ))}
            </Container>
        </div>
    );
};

export default Utgifter;
