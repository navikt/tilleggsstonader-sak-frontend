import React, { useEffect } from 'react';

import { VStack } from '@navikt/ds-react';

import { KollektivDetaljer } from './KollektivDetaljer';
import { Reisedata } from './Typer/Reisedata';
import { StatiskKartRequest } from './Typer/StatiskKartRequest';

export const Reisedetaljer: React.FC<{
    kjøreavstandResponse: Reisedata;
    kollektivDetaljerResponse: Reisedata;
    hentStatiskKart: (statiskKartRequest: StatiskKartRequest) => void;
    statiskKart: string | undefined;
}> = ({ kjøreavstandResponse, kollektivDetaljerResponse, hentStatiskKart }) => {
    useEffect(() => {
        if (kjøreavstandResponse.reiserute) {
            hentStatiskKart({
                polyline: kjøreavstandResponse.reiserute.polyline.encodedPolyline,
                startLokasjon: kjøreavstandResponse.reiserute.startLokasjon,
                sluttLokasjon: kjøreavstandResponse.reiserute.sluttLokasjon,
            });
        }
    }, [kjøreavstandResponse, hentStatiskKart]);

    return (
        <VStack gap="4">
            <KollektivDetaljer reisedata={kollektivDetaljerResponse} />
        </VStack>
    );
};
