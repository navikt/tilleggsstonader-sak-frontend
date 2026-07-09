import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useAndreKjørelisteBehandlingerPåVent } from '../../../hooks/useAndreKjørelisteBehandlingerPåVent';

export const AndreKjørelisteBehandlingerPåVentAlert: React.FC = () => {
    const antall = useAndreKjørelisteBehandlingerPåVent();

    if (antall === 0) return null;

    return (
        <Alert variant="info" size="small">
            Det finnes{' '}
            {antall === 1
                ? 'én annen kjørelistebehandling'
                : `${antall} andre kjørelistebehandlinger`}{' '}
            på vent for denne brukeren.
        </Alert>
    );
};
