import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import UtgifterValg from './UtgifterValg';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../../hooks/felles/useListState';
import { GrunnlagBarn } from '../../../../vilkår';
import { UtgifterPerBarn } from '../../utils';
import { InnvilgeVedtakForm } from '../InnvilgeBarnetilsyn';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

interface Props {
    errorState: FormErrors<UtgifterPerBarn[]>;
    utgifterState: ListState<UtgifterPerBarn>;
    barnIBehandling: GrunnlagBarn[];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const Utgifter: React.FC<Props> = ({
    utgifterState,
    barnIBehandling,
    errorState,
    //settValideringsFeil, // todo send videre?
}) => {
    const oppdaterUtgift = (oppdatertUtgift: UtgifterPerBarn, indeks: number) => {
        utgifterState.update(oppdatertUtgift, indeks);
    };

    const barnPerBarnId = barnIBehandling.reduce(
        (acc, barn) => {
            acc[barn.barnId] = barn;
            return acc;
        },
        {} as Record<string, GrunnlagBarn>
    );

    return (
        <div>
            <Heading spacing size="small" level="5">
                Dokumenterte utgifter
            </Heading>
            <Container>
                {utgifterState.value.map((utgifterPerBarn, index) => {
                    const grunnlagBarn = barnPerBarnId[utgifterPerBarn.barnId];
                    if (!grunnlagBarn) {
                        return <div>Finner ikke barn</div>;
                    }
                    return (
                        <UtgifterValg
                            utgifterPerBarn={utgifterPerBarn}
                            barn={grunnlagBarn}
                            errorState={errorState && errorState[index]}
                            key={utgifterPerBarn.barnId}
                            oppdaterUtgift={(barn) => oppdaterUtgift(barn, index)}
                        />
                    );
                })}
            </Container>
        </div>
    );
};

export default Utgifter;
