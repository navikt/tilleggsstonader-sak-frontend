import React from 'react';

import { Alert, VStack, BodyShort } from '@navikt/ds-react';

export const VarselOvergangsstønad = () => {
    return (
        <Alert variant="info" size="small">
            <VStack gap="space-8">
                <BodyShort size="small">
                    Hvis personen har rett til overgangsstønad etter de nye reglene i ftrl kap. 15
                    (f.o.m. 1. juli 2026), har personen ikke rett til tilleggsstønader. Se
                    brukermanualen for informasjon om hvordan sakene skal behandles.
                </BodyShort>
                <BodyShort size="small">
                    Hvis personen har rett til overgangsstønad etter tidligere regler i ftrl kap. 15
                    (t.o.m. 30. juni 2026), eller etter overgangsreglene, kan personen ha rett til
                    tilleggsstønader. Disse sakene behandles som tidligere.
                </BodyShort>
            </VStack>
        </Alert>
    );
};
