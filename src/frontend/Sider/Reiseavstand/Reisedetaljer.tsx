import React, { useEffect } from 'react';

import { VStack } from '@navikt/ds-react';

import { Kjøreavstand } from './Kjøreavstand';
import { KollektivDetaljer } from './KollektivDetaljer';
import { Reiserute } from './Typer/Reisedata';
import { StatiskKartRequest } from './Typer/StatiskKartRequest';

export const Reisedetaljer: React.FC<{
    kjøreavstandResponse: Reiserute;
    kollektivDetaljerResponse: Reiserute;
    hentStatiskKart: (statiskKartRequest: StatiskKartRequest) => void;
    statiskKart: string | undefined;
}> = ({ kjøreavstandResponse, kollektivDetaljerResponse, hentStatiskKart, statiskKart }) => {
    useEffect(() => {
        hentStatiskKart({
            polyline: kjøreavstandResponse.polyline.encodedPolyline,
            startLokasjon: kjøreavstandResponse.startLokasjon,
            sluttLokasjon: kjøreavstandResponse.sluttLokasjon,
        });
    }, [kjøreavstandResponse, hentStatiskKart]);

    return (
        <VStack gap={'4'} align={'stretch'} width={'540px'}>
            <Kjøreavstand rute={kjøreavstandResponse} />
            {statiskKart && <img src={statiskKart} alt={'Kart for reisen'} />}
            <KollektivDetaljer rute={kollektivDetaljerResponse} />
        </VStack>
    );
};
