import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { UtgifterBil } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';

export const PrivatBilDetaljer: React.FC<{ utgifterBil: UtgifterBil }> = ({ utgifterBil }) => (
    <>
        {utgifterBil.mottarGrunnstønad && (
            <VStack>
                <Label size={'small'}>Mottar du grunnstønad fra nav?</Label>
                <BodyShort size="small">{jaNeiTilTekst[utgifterBil.mottarGrunnstønad]}</BodyShort>
            </VStack>
        )}

        {utgifterBil.parkering && (
            <VStack>
                <Label size={'small'}>Må du betale for parkering med egen bil?</Label>
                <BodyShort size="small">{jaNeiTilTekst[utgifterBil.parkering]}</BodyShort>
            </VStack>
        )}

        {utgifterBil.bompenger && (
            <VStack>
                <Label size={'small'}>Bompenger én vei</Label>
                <BodyShort size="small">{`${utgifterBil.bompenger} kr`}</BodyShort>
            </VStack>
        )}

        {utgifterBil.ferge && (
            <VStack>
                <Label size={'small'}>Ferge én vei</Label>
                <BodyShort size="small">{`${utgifterBil.ferge} kr`}</BodyShort>
            </VStack>
        )}

        {utgifterBil.piggdekkavgift && (
            <VStack>
                <Label size={'small'}>Piggdekkavgift per dag</Label>
                <BodyShort size="small">{`${utgifterBil.piggdekkavgift} kr`}</BodyShort>
            </VStack>
        )}
    </>
);
