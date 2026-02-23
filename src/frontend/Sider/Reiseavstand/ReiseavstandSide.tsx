import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Alert, Heading, VStack } from '@navikt/ds-react';

import { Kart } from './Kart';
import { Reiseavstand } from './Reiseavstand';
import { ReiseavstandForm } from './ReiseavstandForm';
import styles from './ReiseavstandSide.module.css';
import { Reisedetaljer } from './Reisedetaljer';
import { ReiseMetadata } from './ReiseMetadata';
import { StatiskKart } from './StatiskKart';
import { useHentGoogleMapsData } from './useHentGoogleMapsData';
import DataViewer from '../../komponenter/DataViewer';
import { Toggle } from '../../utils/toggles';

export const ReiseavstandSide: React.FC = () => {
    const brukDynamiskKart = useFlag(Toggle.BRUK_DYNAMISK_KART);
    const {
        kjøreavstandResponse,
        kollektivDetaljerResponse,
        hentKjøreavstand,
        hentKollektivDetaljer,
        resetGoogleMapsData,
        hentStatiskKart,
        hentAdresseForslag,
        statiskKart,
    } = useHentGoogleMapsData();

    return (
        <VStack gap={'space-32'} padding={'space-32'} className={styles.marginBottom}>
            <div className={styles.container}>
                <VStack gap={'space-16'} className={styles.venstreKolonne}>
                    <Alert variant={'info'}>Løsningen skal ikke brukes på kode 6/7-brukere.</Alert>
                    <Heading size={'small'}>Beregn reiseavstand</Heading>
                    <ReiseavstandForm
                        hentKjøreavstand={hentKjøreavstand}
                        hentKollektivDetaljer={hentKollektivDetaljer}
                        resetGoogleMapsData={resetGoogleMapsData}
                        hentAdresseForslag={hentAdresseForslag}
                    />
                    <DataViewer response={{ kjøreavstandResponse }} type={'reisedata'}>
                        {({ kjøreavstandResponse }) => (
                            <>
                                <ReiseMetadata kjøreavstandResponse={kjøreavstandResponse} />
                                <Reiseavstand reisedata={kjøreavstandResponse} />
                            </>
                        )}
                    </DataViewer>
                    <DataViewer
                        response={{ kjøreavstandResponse, kollektivDetaljerResponse }}
                        type={'reisedata'}
                    >
                        {({ kjøreavstandResponse, kollektivDetaljerResponse }) => (
                            <Reisedetaljer
                                kjøreavstandResponse={kjøreavstandResponse}
                                kollektivDetaljerResponse={kollektivDetaljerResponse}
                                hentStatiskKart={hentStatiskKart}
                                statiskKart={statiskKart}
                            />
                        )}
                    </DataViewer>
                </VStack>
                <div
                    className={brukDynamiskKart ? styles.høyreKolonne : styles.høyreKolonneStatisk}
                >
                    <DataViewer response={{ kjøreavstandResponse }} type={'kartdata'}>
                        {({ kjøreavstandResponse }) =>
                            brukDynamiskKart ? (
                                <Kart kjøreavstandResponse={kjøreavstandResponse} />
                            ) : (
                                <StatiskKart
                                    kjøreavstandResponse={kjøreavstandResponse}
                                    hentStatiskKart={hentStatiskKart}
                                    statiskKart={statiskKart}
                                />
                            )
                        }
                    </DataViewer>
                </div>
            </div>
        </VStack>
    );
};
