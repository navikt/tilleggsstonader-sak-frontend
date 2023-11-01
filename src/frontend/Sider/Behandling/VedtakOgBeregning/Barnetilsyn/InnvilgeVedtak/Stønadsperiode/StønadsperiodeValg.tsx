import React from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../../hooks/felles/useListState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import { Stønadsperiode, StønadsperiodeProperty } from '../../../../../../typer/vedtak';
import { tomStønadsperiodeRad } from '../../utils';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;

    > :nth-child(3n + 3) {
        grid-column: 1;
    }
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

    const leggTilTomRadUnder = (indeks: number) => {
        stønadsperioderState.setValue((prevState) => [
            ...prevState.slice(0, indeks + 1),
            tomStønadsperiodeRad(),
            ...prevState.slice(indeks + 1, prevState.length),
        ]);
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
                    <React.Fragment key={stønadsperiode.endretKey}>
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
                        <Button
                            type="button"
                            onClick={() => leggTilTomRadUnder(indeks)}
                            variant="tertiary"
                            icon={<PlusCircleIcon />}
                            size="small"
                        />
                    </React.Fragment>
                ))}
            </Grid>
        </div>
    );
};

export default StønadsperiodeValg;
