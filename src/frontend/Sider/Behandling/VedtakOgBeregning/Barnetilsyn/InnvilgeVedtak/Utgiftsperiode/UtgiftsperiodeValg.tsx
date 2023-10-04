import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import AktivitetSelect from './AktivitetSelect';
import AntallDagerSelect from './AntallDagerSelect';
import PeriodetypeSelect from './PeriodetypeSelect';
import { useBehandling } from '../../../../../../context/BehandlingContext';
import { ListState } from '../../../../../../hooks/felles/useListState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import { Utgiftsperiode, UtgiftsperiodeProperty } from '../../../../../../typer/vedtak';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const Grid = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning
            ? 'repeat(7, max-content)'
            : '9rem  repeat(2, max-content) 9rem 20rem 2rem 4rem repeat(2, max-content)'};
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
        index: number,
        property: UtgiftsperiodeProperty,
        value: string | string[] | number | boolean | undefined
    ) => {
        utgiftsperioderState.update(
            {
                ...utgiftsperioderState.value[index],
                [property]: value,
            },
            index
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
            <Grid lesevisning={!behandlingErRedigerbar}>
                <Label>Periodetype</Label>
                <Label>Fra</Label>
                <Label>Til</Label>
                <Label>Aktivitet</Label>
                <Label>Aktivitetsdager</Label>
                <Label>Velg barn</Label>
                <Label>Utgifter</Label>
                <Label>Dager med tilsyn</Label>
                {utgiftsperioderState.value.map((utgiftsperiode, index) => (
                    <React.Fragment key={index}>
                        <PeriodetypeSelect
                            className={'ny-rad'}
                            periodetype={utgiftsperiode.periodetype}
                            oppdaterUtgiftsperiodeElement={(property, value) =>
                                oppdaterUtgiftsperiode(index, property, value)
                            }
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <DateInput
                            label="Fra"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={utgiftsperiode.fra}
                            onChange={(dato?: Date) =>
                                oppdaterDatofelter(index, UtgiftsperiodeProperty.fra, dato)
                            }
                        />
                        <DateInput
                            label="Til"
                            hideLabel
                            erLesevisning={!behandlingErRedigerbar}
                            value={utgiftsperiode.til}
                            onChange={(dato?: Date) =>
                                oppdaterDatofelter(index, UtgiftsperiodeProperty.til, dato)
                            }
                        />

                        {/* TODO: Håndtere tilfeller hvor aktivitet ikke skal velges (f.eks. opp) */}
                        <AktivitetSelect
                            aktivitet={utgiftsperiode.aktivitetstype}
                            oppdaterUtgiftsperiodeElement={(property, value) =>
                                oppdaterUtgiftsperiode(index, property, value)
                            }
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <AntallDagerSelect
                            erLesevisning={!behandlingErRedigerbar}
                            property={UtgiftsperiodeProperty.antallAktivitetsdager}
                            value={utgiftsperiode.antallAktivitetsdager}
                            oppdaterUtgiftsperiodeElement={(value) =>
                                oppdaterUtgiftsperiode(
                                    index,
                                    UtgiftsperiodeProperty.antallAktivitetsdager,
                                    value
                                )
                            }
                        />
                        <p>Barn</p>
                        <p>Utgifter</p>

                        <AntallDagerSelect
                            erLesevisning={!behandlingErRedigerbar}
                            property={UtgiftsperiodeProperty.dagerMedTilsyn}
                            value={utgiftsperiode.dagerMedTilsyn}
                            oppdaterUtgiftsperiodeElement={(value) =>
                                oppdaterUtgiftsperiode(
                                    index,
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
