import React from 'react';

import { Alert, BodyShort, VStack } from '@navikt/ds-react';

export const VedtakOgBeregningFlytting: React.FC = () => {
    return (
        <VStack gap="space-16">
            <Alert variant="info">
                <BodyShort>
                    Beregning og vedtaksfatting for flytting er ikke tilgjengelig ennå. Behandlingen
                    kan ikke gå videre fra dette steget.
                </BodyShort>
            </Alert>
        </VStack>
    );
};
