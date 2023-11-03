import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import UtgifterValg from './UtgifterValg';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../../hooks/felles/useRecordState';
import { Utgift } from '../../../../../../typer/vedtak';
import { GrunnlagBarn } from '../../../../vilkår';
import { tomUtgiftRad } from '../../utils';
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
    const oppdaterUtgift = (barnId: string, utgiftIndex: number, oppdatertUtgift: Utgift) => {
        const oppdaterteUtgifter = utgifterState.value[barnId].map((utgift, indeks) =>
            indeks === utgiftIndex ? oppdatertUtgift : utgift
        );

        utgifterState.update(barnId, oppdaterteUtgifter);
    };

    const leggTilTomRadUnder = (barnId: string, utgiftIndex: number) => {
        const prevState = utgifterState.value[barnId];
        utgifterState.update(barnId, [
            ...prevState.slice(0, utgiftIndex + 1),
            tomUtgiftRad(),
            ...prevState.slice(utgiftIndex + 1, prevState.length),
        ]);
    };

    const slettPeriode = (barnId: string, utgiftIndex: number) => {
        const oppdaterteUtgifter = utgifterState.value[barnId].filter((_, i) => i != utgiftIndex);

        utgifterState.update(barnId, oppdaterteUtgifter);

        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
            const utgiftsperioder = (
                (prevState.utgifter && prevState.utgifter[barnId]) ??
                []
            ).splice(utgiftIndex, 1);
            return { ...prevState, utgiftsperioder };
        });
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
                        leggTilTomRadUnder={(utgiftIndeks: number) =>
                            leggTilTomRadUnder(barn.barnId, utgiftIndeks)
                        }
                        slettPeriode={(utgiftIndeks: number) =>
                            slettPeriode(barn.barnId, utgiftIndeks)
                        }
                    />
                ))}
            </Container>
        </div>
    );
};

export default Utgifter;
