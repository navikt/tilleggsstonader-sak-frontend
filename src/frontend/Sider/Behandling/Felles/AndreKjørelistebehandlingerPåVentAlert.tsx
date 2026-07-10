import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useErKjørelistebehandlingerPåVent } from '../../../hooks/useErKjørelistebehandlingerPåVent';

export const AndreKjørelistebehandlingerPåVentAlert: React.FC = () => {
    const kjørelistebehandlingPåVent = useErKjørelistebehandlingerPåVent();

    if (kjørelistebehandlingPåVent === 0) return null;

    return (
        <Alert variant="info" size="small">
            Det finnes{' '}
            {kjørelistebehandlingPåVent === 1
                ? 'én annen kjørelistebehandling'
                : `${kjørelistebehandlingPåVent} andre kjørelistebehandlinger`}{' '}
            på vent for denne brukeren.
        </Alert>
    );
};
