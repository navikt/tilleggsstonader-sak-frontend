import React from 'react';

import styled from 'styled-components';

import { Alert, Heading } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { formaterTilTekstligDato } from '../../../utils/dato';

const Container = styled.div`
    margin: 1rem 2rem 0 2rem;
`;

export const VarselVedtakIArena = () => {
    const { behandlingFakta } = useBehandling();

    const vedtakTom = behandlingFakta.arena?.vedtakTom;
    if (!vedtakTom) {
        return null;
    }
    return (
        <Container>
            <Alert variant={'warning'} size={'small'}>
                <Heading size={'xsmall'} level="3">
                    Søker har vedtak i Arena på tilsyn barn innvilget til og med{' '}
                    {formaterTilTekstligDato(vedtakTom)}
                </Heading>
                Skal du innvilge tilbake i tid? Gå til Arena for å sjekke at det ikke blir
                overlappende utbetalinger.
            </Alert>
        </Container>
    );
};
