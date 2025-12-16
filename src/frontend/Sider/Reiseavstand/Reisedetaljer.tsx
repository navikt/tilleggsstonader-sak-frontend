import React, { useEffect } from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { KollektivDetaljer } from './KollektivDetaljer';
import { Reiseavstand } from './Reiseavstand';
import styles from './Reisedetaljer.module.css';
import { Reisedata } from './Typer/Reisedata';
import { StatiskKartRequest } from './Typer/StatiskKartRequest';

export const Reisedetaljer: React.FC<{
    kjøreavstandResponse: Reisedata;
    kollektivDetaljerResponse: Reisedata;
    hentStatiskKart: (statiskKartRequest: StatiskKartRequest) => void;
    statiskKart: string | undefined;
}> = ({ kjøreavstandResponse, kollektivDetaljerResponse, hentStatiskKart, statiskKart }) => {
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
        <HStack gap="4">
            <VStack gap="4">
                <Reiseavstand reisedata={kjøreavstandResponse} />
                <KollektivDetaljer reisedata={kollektivDetaljerResponse} />
            </VStack>
            {statiskKart && (
                <img className={styles.kartBilde} src={statiskKart} alt={'Kart for reisen'} />
            )}
        </HStack>
    );
};
