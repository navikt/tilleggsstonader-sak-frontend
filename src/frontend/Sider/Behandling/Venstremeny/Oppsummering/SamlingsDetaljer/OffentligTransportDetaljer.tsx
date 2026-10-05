import React from 'react';

import { FaktaOffentligTransportInfo } from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { SøknadInfoFelt } from '../Visningskomponenter';

function formatKr(value?: string) {
    return value !== undefined && value !== null ? `${value} kr` : '-';
}

export const OffentligTransportDetaljer: React.FC<{
    offentligTransport: FaktaOffentligTransportInfo;
}> = ({ offentligTransport }) => (
    <SøknadInfoFelt
        label="Totale utgifter til offentlig transport"
        value={formatKr(offentligTransport.totalUtgifterOffentligTransport)}
    />
);
