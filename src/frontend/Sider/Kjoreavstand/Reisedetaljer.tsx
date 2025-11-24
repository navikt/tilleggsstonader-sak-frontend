import React from 'react';

import { VStack } from '@navikt/ds-react';

import { Kjøreavstand } from './Kjøreavstand/Kjøreavstand';
import { KollektivDetaljer } from './KollektivDetaljer';
import { Reiserute } from './Reisedata';

export const Reisedetaljer: React.FC<{
    kjøreavstandResponse: Reiserute;
    kollektivDetaljerResponse: Reiserute;
}> = ({ kjøreavstandResponse, kollektivDetaljerResponse }) => {
    return (
        <VStack gap={'4'} align={'stretch'} width={'400px'}>
            <Kjøreavstand rute={kjøreavstandResponse} />
            <KollektivDetaljer rute={kollektivDetaljerResponse} />
        </VStack>
    );
};
