import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../../hooks/felles/useListState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import { Stønadsperiode, StønadsperiodeProperty } from '../../../../../../typer/vedtak';
import { tomStønadsperiodeRad } from '../../utils';
import { InnvilgeVedtakForm } from '../InnvilgeBarnetilsyn';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;

    > :nth-child(3n) {
        grid-column: 1;
    }
`;

interface Props {
    errorState: FormErrors<Stønadsperiode[]>;
    stønadsperioderState: ListState<Stønadsperiode>;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const StønadsperiodeValg: React.FC<Props> = ({
    stønadsperioderState,
    errorState,
    settValideringsFeil,
}) => {
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

    const slettPeriode = (indeks: number) => {
        stønadsperioderState.remove(indeks);

        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
            const stønadsperioder = (prevState.stønadsperioder ?? []).filter(
                (_, i) => i !== indeks
            );
            return { ...prevState, stønadsperioder };
        });
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
                        <div>
                            <Button
                                type="button"
                                onClick={() => leggTilTomRadUnder(indeks)}
                                variant="tertiary"
                                icon={<PlusCircleIcon />}
                                size="small"
                            />
                            {indeks !== 0 && (
                                <Button
                                    type="button"
                                    onClick={() => slettPeriode(indeks)}
                                    variant="tertiary"
                                    icon={<TrashIcon />}
                                    size="small"
                                />
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </Grid>
        </div>
    );
};

export default StønadsperiodeValg;
