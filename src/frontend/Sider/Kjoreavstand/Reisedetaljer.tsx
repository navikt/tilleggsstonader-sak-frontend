import React, { useEffect } from 'react';

import { VStack } from '@navikt/ds-react';

import { Kjøreavstand } from './Kjøreavstand/Kjøreavstand';
import { KollektivDetaljer } from './KollektivDetaljer';
import { Reiserute } from './Reisedata';

export const Reisedetaljer: React.FC<{
    kjøreavstandResponse: Reiserute;
    kollektivDetaljerResponse: Reiserute;
    hentStatiskKart: (polyline: string) => void;
    statiskKart: string | undefined;
}> = ({ kjøreavstandResponse, kollektivDetaljerResponse, hentStatiskKart, statiskKart }) => {
    useEffect(() => {
        hentStatiskKart(kjøreavstandResponse.polyline.encodedPolyline);
    }, [kjøreavstandResponse, hentStatiskKart]);
    return (
        <VStack gap={'4'} align={'stretch'} width={'400px'}>
            <Kjøreavstand rute={kjøreavstandResponse} />
            <KollektivDetaljer rute={kollektivDetaljerResponse} />
            {statiskKart && <img src={statiskKart} alt={'Kart for reisen'} />}
        </VStack>
    );
};
