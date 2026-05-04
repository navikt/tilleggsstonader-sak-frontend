import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import {
    Taxi,
    ÅrsakIkkeKjøreBil,
    ÅrsakIkkeKjøreBilTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { SøknadInfoFelt } from '../Visningskomponenter';

export const TaxiDetaljer: React.FC<{ taxi: Taxi }> = ({ taxi }) => (
    <>
        <SøknadInfoFelt
            label="Hvorfor kan du ikke kjøre bil til aktivitetsstedet?"
            value={
                <VStack gap="space-4">
                    {taxi.årsakIkkeKjøreBil.map((årsak: ÅrsakIkkeKjøreBil) => (
                        <BodyShort key={årsak} size="small">
                            {ÅrsakIkkeKjøreBilTilTekst[årsak]}
                        </BodyShort>
                    ))}
                </VStack>
            }
        />

        {taxi.ønskerSøkeOmTaxi && (
            <SøknadInfoFelt
                label="Ønsker du å søke om å få dekket utgifter til reise med taxi?"
                value={jaNeiTilTekst[taxi.ønskerSøkeOmTaxi]}
            />
        )}

        {taxi.ttkort && (
            <SøknadInfoFelt
                label="Har du et TT-kort som du kan bruke til aktiviteter i tiltak?"
                value={jaNeiTilTekst[taxi.ttkort]}
            />
        )}
    </>
);
