import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import AktivitetSelect from './AktivitetSelect';
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

const UtgiftsperiodeValg: React.FC<Props> = () => {
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
                <Label>Velg barn</Label>
                <Label>Ant.</Label>
                <Label>Utgifter</Label>
                {utgiftsperioderState.value.map((utgiftsperiode, index) => {
                    const { periodetype, aktivitetstype } = utgiftsperiode;
                    return (
                        <React.Fragment key={index}>
                            <PeriodetypeSelect
                                className={'ny-rad'}
                                periodetype={periodetype}
                                oppdaterUtgiftsperiodeElement={(property, value) =>
                                    oppdaterUtgiftsperiode(index, property, value)
                                }
                                lesevisning={!behandlingErRedigerbar}
                            />
                            <DateInput
                                label="Fra"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                onChange={(dato?: Date) =>
                                    oppdaterDatofelter(index, UtgiftsperiodeProperty.fra, dato)
                                }
                            />
                            <DateInput
                                label="Til"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                onChange={(dato?: Date) =>
                                    oppdaterDatofelter(index, UtgiftsperiodeProperty.til, dato)
                                }
                            />

                            {/* TODO: Håndtere tilfeller hvor aktivitet ikke skal velges (f.eks. opp) */}
                            <AktivitetSelect
                                aktivitet={aktivitetstype}
                                oppdaterUtgiftsperiodeElement={(property, value) =>
                                    oppdaterUtgiftsperiode(index, property, value)
                                }
                                erLesevisning={!behandlingErRedigerbar}
                            />
                        </React.Fragment>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default UtgiftsperiodeValg;
