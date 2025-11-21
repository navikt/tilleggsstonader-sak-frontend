import React from 'react';

import { VStack } from '@navikt/ds-react';

import { Kjøreavstand } from './Kjøreavstand/Kjøreavstand';
import { KollektivDetaljer } from './KollektivDetaljer';
import { Reisedata } from './Reisedata';

export const Reisedetaljer: React.FC<{
    kjøreavstandResponse: Reisedata;
    kollektivDetaljerResponse: Reisedata;
}> = ({ kjøreavstandResponse, kollektivDetaljerResponse }) => {
    return (
        <VStack gap={'4'} align={'stretch'} width={'400px'}>
            {kjøreavstandResponse?.ruter?.map((route, routeIndex) => (
                <Kjøreavstand key={routeIndex} rute={route} />
            ))}
            {kollektivDetaljerResponse?.ruter?.map((route, routeIndex) => (
                <KollektivDetaljer key={routeIndex} rute={route} />
            ))}
        </VStack>
    );
};
