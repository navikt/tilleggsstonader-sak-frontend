import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../../hooks/felles/useListState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import { Stønadsperiode, StønadsperiodeProperty } from '../../../../../../typer/vedtak';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

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
        <Container>
            <Heading spacing size="small" level="5">
                Perioder for stønad
            </Heading>
            <Grid>
                <Label>Fra</Label>
                <Label>Til</Label>
                {stønadsperioderState.value.map((stønadsperiode, indeks) => (
                    <React.Fragment key={indeks}>
                        <DateInput
                            label="Fra"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={stønadsperiode.fra}
                            onChange={(dato?: string) =>
                                oppdaterUtgiftsperiode(indeks, StønadsperiodeProperty.FRA, dato)
                            }
                            size="small"
                            feil={errorState && errorState[indeks]?.fra}
                        />
                        <DateInput
                            label="Til"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={stønadsperiode.til}
                            onChange={(dato?: string) =>
                                oppdaterUtgiftsperiode(indeks, StønadsperiodeProperty.TIL, dato)
                            }
                            size="small"
                            feil={errorState && errorState[indeks]?.til}
                        />
                    </React.Fragment>
                ))}
            </Grid>
        </Container>
    );
};

export default StønadsperiodeValg;
