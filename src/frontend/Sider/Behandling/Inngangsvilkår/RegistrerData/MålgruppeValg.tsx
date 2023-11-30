import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label } from '@navikt/ds-react';

import { MålgruppePeriode, MålgruppePeriodeProperty, RegistrerDataForm } from './typer';
import { tomMålgruppeRad } from './utils';
import { useBehandling } from '../../../../context/BehandlingContext';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { leggTilTomRadUnderIListe } from '../../VedtakOgBeregning/Barnetilsyn/utils';

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
    errorState: FormErrors<MålgruppePeriode[]>;
    målgruppePerioderState: ListState<MålgruppePeriode>;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<RegistrerDataForm>>>;
}

const MålgruppePeriodeValg: React.FC<Props> = ({
    målgruppePerioderState: målgruppePerioderState,
    errorState,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const oppdaterStønadsperiode = (
        indeks: number,
        property: MålgruppePeriodeProperty,
        value: string | undefined
    ) => {
        målgruppePerioderState.update(
            {
                ...målgruppePerioderState.value[indeks],
                [property]: value,
            },
            indeks
        );
    };

    const leggTilTomRadUnder = (indeks: number) => {
        målgruppePerioderState.setValue((prevState) =>
            leggTilTomRadUnderIListe(prevState, tomMålgruppeRad(), indeks)
        );
    };

    const slettPeriode = (indeks: number) => {
        målgruppePerioderState.remove(indeks);

        settValideringsFeil((prevState: FormErrors<RegistrerDataForm>) => {
            const stønadsperioder = (prevState.målgruppePerioder ?? []).splice(indeks, 1);
            return { ...prevState, stønadsperioder };
        });
    };

    return (
        <div>
            <Heading spacing size="small" level="5">
                Perioder for målgrupper
            </Heading>
            <Grid>
                <Label size="small">Fra</Label>
                <Label size="small">Til</Label>
                {målgruppePerioderState.value.map((stønadsperiode, indeks) => (
                    <React.Fragment key={indeks}>
                        <DateInput
                            label="Fra"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={stønadsperiode.fom}
                            onChange={(dato?: string) =>
                                oppdaterStønadsperiode(indeks, MålgruppePeriodeProperty.FOM, dato)
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
                                oppdaterStønadsperiode(indeks, MålgruppePeriodeProperty.TOM, dato)
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

export default MålgruppePeriodeValg;
