import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Alert, BodyLong, Heading, HStack, ReadMore, VStack } from '@navikt/ds-react';

import { ReiseavstandForm } from './ReiseavstandForm';
import { Reisedetaljer } from './Reisedetaljer';
import { StatiskKart } from './StatiskKart';
import { useHentGoogleMapsData } from './useHentGoogleMapsData';
import DataViewer from '../../komponenter/DataViewer';
import { Toggle } from '../../utils/toggles';

export const ReiseavstandSide: React.FC = () => {
    const visKartside = useFlag(Toggle.VIS_KARTSIDE);
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

    if (!visKartside) {
        return <p>Denne siden er under arbeid</p>;
    }

    return (
        <VStack gap={'8'} padding={'8'}>
            <Alert variant={'info'}>Løsningen skal ikke brukes på kode 6/7 brukere</Alert>
            <HStack gap={'16'}>
                <VStack gap={'4'}>
                    <Heading size={'small'}>Beregn reiseavstand</Heading>
                    <ReadMore header={'Hva kan du gjøre på denne siden?'} size={'small'}>
                        <BodyLong size={'small'}>
                            Her kan du sjekke kilometerkravet ved å finne avstanden mellom to
                            adresser.
                            <br />
                            Grønn markør viser start adressen. <br />
                            Rød markør viser slutt adressen. <br />
                        </BodyLong>
                    </ReadMore>
                    <ReiseavstandForm
                        hentKjøreavstand={hentKjøreavstand}
                        hentKollektivDetaljer={hentKollektivDetaljer}
                        resetGoogleMapsData={resetGoogleMapsData}
                        hentAdresseForslag={hentAdresseForslag}
                    />
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
                <DataViewer response={{ kjøreavstandResponse }} type={'kartdata'}>
                    {({ kjøreavstandResponse }) => (
                        <StatiskKart
                            kjøreavstandResponse={kjøreavstandResponse}
                            hentStatiskKart={hentStatiskKart}
                            statiskKart={statiskKart}
                        />
                    )}
                </DataViewer>
            </HStack>
        </VStack>
    );
};
