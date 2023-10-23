import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../../hooks/felles/useListState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import { Stønadsperiode, StønadsperiodeProperty } from '../../../../../../typer/vedtak';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;
`;

interface Props {
    errorState: FormErrors<Stønadsperiode[]>;
    stønadsperioderState: ListState<Stønadsperiode>;
}

const StønadsperiodeValg: React.FC<Props> = ({ stønadsperioderState, errorState }) => {
    const { behandlingErRedigerbar } = useBehandling();

    const oppdaterUtgiftsperiode = (
        indeks: number,
        property: StønadsperiodeProperty,
        value: string | undefined
    ) => {
        stønadsperioderState.update(
            {
                ...stønadsperioderState.value[indeks],
                [property]: value,
            },
            indeks
        );
    };

    return (
        <div>
            <Heading spacing size="small" level="5">
                Perioder for stønad
            </Heading>
            <Grid>
                <Label size="small">Fra</Label>
                <Label size="small">Til</Label>
                {stønadsperioderState.value.map((stønadsperiode, indeks) => (
                    // TODO: Skal ikke bruke indeks som key
                    <React.Fragment key={indeks}>
                        <DateInput
                            label="Fra"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={stønadsperiode.fom}
                            onChange={(dato?: string) =>
                                oppdaterUtgiftsperiode(indeks, StønadsperiodeProperty.FOM, dato)
                            }
                            size="small"
                            feil={errorState && errorState[indeks]?.fom}
                        />
                        <DateInput
                            label="Til"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={stønadsperiode.tom}
                            onChange={(dato?: string) =>
                                oppdaterUtgiftsperiode(indeks, StønadsperiodeProperty.TOM, dato)
                            }
                            size="small"
                            feil={errorState && errorState[indeks]?.tom}
                        />
                    </React.Fragment>
                ))}
            </Grid>
        </div>
    );
};

export default StønadsperiodeValg;
