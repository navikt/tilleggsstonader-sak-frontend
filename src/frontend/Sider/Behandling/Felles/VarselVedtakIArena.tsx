import React from 'react';

import styled from 'styled-components';

import { BodyShort, Heading } from '@navikt/ds-react';
import { ABorderDefault, ALimegreen50 } from '@navikt/ds-tokens/dist/tokens';

import { formaterDato } from '../../../utils/dato';

type Props = {
    arenaVedtakTom: string;
};

const Container = styled.div`
    padding: 1rem;
    border: 1px solid ${ABorderDefault};
    background: ${ALimegreen50};
    border-radius: 12px;
`;

export const VarselVedtakIArena = ({ arenaVedtakTom }: Props) => {
    return (
        <Container>
            <Heading size={'xsmall'}>
                {`Søker har vedtak i Arena til og med ${formaterDato(arenaVedtakTom)}`}
            </Heading>
            <BodyShort size={'small'}>
                Skal du innvilge tilbake i tid? Gå til Arena for å sjekke at det ikke blir
                overlappende utbetalinger.
            </BodyShort>
        </Container>
    );
};
