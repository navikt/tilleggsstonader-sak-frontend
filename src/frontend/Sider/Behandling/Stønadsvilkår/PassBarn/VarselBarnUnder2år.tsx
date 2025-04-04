import React from 'react';

import { Alert, Heading } from '@navikt/ds-react';

/**
 * Viser varsel hvis barn er under 2 år under en aktivitet som er oppfylt
 */
export const VarselBarnUnder2År = () => (
    <Alert variant={'warning'} size={'small'}>
        <Heading size={'xsmall'} level="3">
            Mulig kontantstøtte. Søker har barn under 2 år i en aktivitetsperiode.
        </Heading>
        Sjekk om det utbetales kontantstøtte for barnet. Meld fra til utviklingsteamet hvis det er
        tilfelle.
    </Alert>
);
