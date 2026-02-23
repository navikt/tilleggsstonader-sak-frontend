import React from 'react';

import { BodyShort, HelpText, VStack } from '@navikt/ds-react';

export const HjelpetekstDagpenger: React.FC<{
    gjennståendeDagerFraTelleverk?: number;
}> = ({ gjennståendeDagerFraTelleverk }) => (
    <HelpText>
        <VStack>
            <BodyShort size={'small'}>
                Det er ikke registrert noen tom-dato for dagpengevedtaket.
            </BodyShort>
            <BodyShort size={'small'}>
                {`Antall gjenstående dager i telleverket: ${gjennståendeDagerFraTelleverk ?? 'ukjent'}`}
            </BodyShort>
        </VStack>
    </HelpText>
);
