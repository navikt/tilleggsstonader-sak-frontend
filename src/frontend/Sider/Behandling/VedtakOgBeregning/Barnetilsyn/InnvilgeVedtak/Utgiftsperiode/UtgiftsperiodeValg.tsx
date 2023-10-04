import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { ListState } from '../../../../../../hooks/felles/useListState';
import { Utgiftsperiode } from '../../../../../../typer/vedtak';

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
            </Grid>
        </Container>
    );
};

export default UtgiftsperiodeValg;
