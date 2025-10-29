import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import {
    Taxi,
    ÅrsakIkkeKjøreBil,
    ÅrsakIkkeKjøreBilTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';

export const TaxiDetaljer: React.FC<{ taxi: Taxi }> = ({ taxi }) => (
    <>
        <VStack>
            <Label size={'small'}>Hvorfor kan du ikke kjøre bil til aktivitetsstedet?</Label>
            {taxi.årsakIkkeKjøreBil.map((årsak: ÅrsakIkkeKjøreBil) => (
                <BodyShort key={årsak} size="small">
                    {ÅrsakIkkeKjøreBilTilTekst[årsak]}
                </BodyShort>
            ))}
        </VStack>

        {taxi.ønskerSøkeOmTaxi && (
            <VStack>
                <Label size={'small'}>
                    Ønsker du å søke om få dekket utgifter til reise med taxi?
                </Label>
                <BodyShort size="small">{jaNeiTilTekst[taxi.ønskerSøkeOmTaxi]}</BodyShort>
            </VStack>
        )}

        {taxi.ttkort && (
            <VStack>
                <Label size={'small'}>
                    Har du et TT-kort som du kan bruke til aktiviteter i tiltak?
                </Label>
                <BodyShort size="small">{jaNeiTilTekst[taxi.ttkort]}</BodyShort>
            </VStack>
        )}
    </>
);
