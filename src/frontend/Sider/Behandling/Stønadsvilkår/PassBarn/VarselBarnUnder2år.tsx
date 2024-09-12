import React from 'react';

import { Alert, Heading } from '@navikt/ds-react';

export const VarselBarnUnder2År = () => {
    return (
        <Alert variant={'warning'} size={'small'}>
            <Heading size={'xsmall'} level="3">
                Mulig kontantstøtte. Søker har barn under 2 år.
            </Heading>
            Sjekk om det utbetales kontantstøtte for barnet. Meld fra til utviklingsteamet hvis det
            er tilfelle.
        </Alert>
    );
};
