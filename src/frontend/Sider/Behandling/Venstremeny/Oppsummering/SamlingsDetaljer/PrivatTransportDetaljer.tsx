import React from 'react';

import {
    FaktaSamling,
    ÅrsakIkkeOffentligTransportTilTekst,
    drivstofftypeTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { SøknadInfoFelt } from '../Visningskomponenter';

function formatKr(value?: number) {
    return value !== undefined && value !== null ? `${value} kr` : '-';
}

export const PrivatTransportDetaljer: React.FC<{
    privatTransport: FaktaSamling['privatTransport'];
}> = ({ privatTransport }) => {
    if (!privatTransport) return null;

    return (
        <>
            <SøknadInfoFelt
                label="Årsaker til ikke å bruke offentlig transport"
                value={
                    (privatTransport.årsakIkkeOffentligTransport || [])
                        .map((a) => ÅrsakIkkeOffentligTransportTilTekst[a])
                        .join(', ') || '-'
                }
            />

            {privatTransport.kanKjøreMedEgenBil !== undefined && (
                <SøknadInfoFelt
                    label="Kan du kjøre med egen bil?"
                    value={tekstMedFallback(jaNeiTilTekst, privatTransport.kanKjøreMedEgenBil)}
                />
            )}

            {privatTransport.utgifterBil && (
                <>
                    <SøknadInfoFelt
                        label="Parkering"
                        value={tekstMedFallback(
                            jaNeiTilTekst,
                            privatTransport.utgifterBil.parkering
                        )}
                    />
                    <SøknadInfoFelt
                        label="Bompenger"
                        value={formatKr(privatTransport.utgifterBil.bompenger)}
                    />
                    <SøknadInfoFelt
                        label="Fergekostnad"
                        value={formatKr(privatTransport.utgifterBil.fergekostnad)}
                    />
                    <SøknadInfoFelt
                        label="Piggdekkavgift"
                        value={formatKr(privatTransport.utgifterBil.piggdekkavgift)}
                    />
                    <SøknadInfoFelt
                        label="Drivstofftype"
                        value={drivstofftypeTilTekst[privatTransport.utgifterBil.drivstofftype]}
                    />
                </>
            )}
        </>
    );
};
