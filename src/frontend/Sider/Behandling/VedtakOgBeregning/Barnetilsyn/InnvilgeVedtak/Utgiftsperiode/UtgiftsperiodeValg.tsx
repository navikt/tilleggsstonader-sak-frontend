import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import AktivitetSelect from './AktivitetSelect';
import AntallDagerSelect from './AntallDagerSelect';
import PeriodetypeSelect from './PeriodetypeSelect';
import VelgBarn from './VelgBarn';
import { useBehandling } from '../../../../../../context/BehandlingContext';
import { ListState } from '../../../../../../hooks/felles/useListState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import TextField from '../../../../../../komponenter/Skjema/TextField';
import { Utgiftsperiode, UtgiftsperiodeProperty } from '../../../../../../typer/vedtak';
import { harTallverdi, tilTallverdi } from '../../../../../../utils/tall';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const Grid = styled.div<{ $lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.$lesevisning ? 'repeat(7, max-content)' : 'repeat(9, auto)'};
    grid-gap: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    align-items: start;

    .ny-rad {
        grid-column: 1;
    }
`;

interface Props {
    utgiftsperioderState: ListState<Utgiftsperiode>;
}

const UtgiftsperiodeValg: React.FC<Props> = ({ utgiftsperioderState }) => {
    const { behandlingErRedigerbar } = useBehandling();

    const oppdaterUtgiftsperiode = (
        indeks: number,
        property: UtgiftsperiodeProperty,
        value: string | string[] | number | boolean | undefined
    ) => {
        utgiftsperioderState.update(
            {
                ...utgiftsperioderState.value[indeks],
                [property]: value,
            },
            indeks
        );
    };

    const oppdaterDatofelter = (indeks: number, property: UtgiftsperiodeProperty, dato?: Date) => {
        // TODO: Ta hensyn til UTC her?
        const isoDato = dato?.toISOString();
        oppdaterUtgiftsperiode(indeks, property, isoDato);
    };

    return (
        <Container>
            <Heading spacing size="small" level="5">
                Utgifter til barnetilsyn
            </Heading>
            <Grid $lesevisning={!behandlingErRedigerbar}>
                <Label>Periodetype</Label>
                <Label>Fra</Label>
                <Label>Til</Label>
                <Label>Aktivitet</Label>
                <Label>Aktivitetsdager</Label>
                <Label>Velg barn</Label>
                <Label>Utgifter</Label>
                <Label>Dager med tilsyn</Label>
                {utgiftsperioderState.value.map((utgiftsperiode, indeks) => (
                    <React.Fragment key={indeks}>
                        <PeriodetypeSelect
                            className={'ny-rad'}
                            periodetype={utgiftsperiode.periodetype}
                            oppdaterUtgiftsperiodeElement={(property, value) =>
                                oppdaterUtgiftsperiode(indeks, property, value)
                            }
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <DateInput
                            label="Fra"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={utgiftsperiode.fra}
                            onChange={(dato?: Date) =>
                                oppdaterDatofelter(indeks, UtgiftsperiodeProperty.fra, dato)
                            }
                        />
                        <DateInput
                            label="Til"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={utgiftsperiode.til}
                            onChange={(dato?: Date) =>
                                oppdaterDatofelter(indeks, UtgiftsperiodeProperty.til, dato)
                            }
                        />

                        {/* TODO: Håndtere tilfeller hvor aktivitet ikke skal velges (f.eks. opp) */}
                        <AktivitetSelect
                            aktivitet={utgiftsperiode.aktivitetstype}
                            oppdaterUtgiftsperiodeElement={(property, value) =>
                                oppdaterUtgiftsperiode(indeks, property, value)
                            }
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <AntallDagerSelect
                            erLesevisning={!behandlingErRedigerbar}
                            property={UtgiftsperiodeProperty.antallAktivitetsdager}
                            value={utgiftsperiode.antallAktivitetsdager}
                            oppdaterUtgiftsperiodeElement={(value) =>
                                oppdaterUtgiftsperiode(
                                    indeks,
                                    UtgiftsperiodeProperty.antallAktivitetsdager,
                                    value
                                )
                            }
                        />

                        <VelgBarn
                            barn={[
                                { barnId: 'id1', registergrunnlag: { navn: 'Ronja Røverdatter' } },
                                { barnId: 'id2', registergrunnlag: { navn: 'Espen Askeladden' } },
                            ]}
                            oppdaterUtgiftsperiodeElement={(value) =>
                                oppdaterUtgiftsperiode(indeks, UtgiftsperiodeProperty.barn, value)
                            }
                        />

                        <TextField
                            erLesevisning={!behandlingErRedigerbar}
                            label="Utgifter"
                            hideLabel
                            value={
                                harTallverdi(utgiftsperiode.utgifter) ? utgiftsperiode.utgifter : ''
                            }
                            onChange={(e) =>
                                oppdaterUtgiftsperiode(
                                    indeks,
                                    UtgiftsperiodeProperty.utgifter,
                                    tilTallverdi(e.target.value)
                                )
                            }
                        />

                        <AntallDagerSelect
                            erLesevisning={!behandlingErRedigerbar}
                            property={UtgiftsperiodeProperty.dagerMedTilsyn}
                            value={utgiftsperiode.dagerMedTilsyn}
                            oppdaterUtgiftsperiodeElement={(value) =>
                                oppdaterUtgiftsperiode(
                                    indeks,
                                    UtgiftsperiodeProperty.dagerMedTilsyn,
                                    value
                                )
                            }
                        />
                    </React.Fragment>
                ))}
            </Grid>
        </Container>
    );
};

export default UtgiftsperiodeValg;
