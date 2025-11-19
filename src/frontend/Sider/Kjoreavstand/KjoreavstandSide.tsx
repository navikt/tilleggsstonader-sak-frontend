import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { BodyLong, Heading, ReadMore, VStack } from '@navikt/ds-react';

import { KjøreavstandCard } from './KjøreavstandCard';
import { Toggle } from '../../utils/toggles';

export const KjoreavstandSide: React.FC = () => {
    const visKartside = useFlag(Toggle.VIS_KARTSIDE);

    if (!visKartside) {
        return <p>Denne siden er under arbeid</p>;
    }

    return (
        <VStack gap={'4'} padding={'8'}>
            <Heading size={'small'}>Velkommen til den nye siden for å beregne kjøreavstand</Heading>
            <ReadMore header={'Hva kan du gjøre på denne siden?'}>
                <BodyLong size={'small'}>
                    Her kan du sjekke kilometerkravet ved å finne avstanden mellom to punkter uten å
                    bruke google maps. For å kunne beregne riktig avstand mellom bostedsadresse og
                    tiltaksadresse, må adressene være så korrekte som mulig. Fyll derfor ut alle
                    feltene.
                    <br />
                    <br />
                    For å unngå feiltolkning av adressen, skriv den i følgende format: Adresse,
                    postnummer, poststed.
                    <br /> <b>For eksempel: Fyrstikkalléen 1, 0661 Oslo</b>
                </BodyLong>
            </ReadMore>
            <KjøreavstandCard />
        </VStack>
    );
};
