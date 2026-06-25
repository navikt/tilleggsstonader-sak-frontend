import React from 'react';

import { Alert } from '@navikt/ds-react';

export const KjørelisteBehandlingPåVentAlert: React.FC = () => (
    <Alert variant="warning" size="small">
        <strong>Det finnes en kjørelistebehandling på vent.</strong> Denne må behandles før det kan
        gjøres en revurdering.
    </Alert>
);
