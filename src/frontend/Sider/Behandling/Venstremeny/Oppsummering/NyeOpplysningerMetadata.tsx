import React from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import {
    nyeOpplysningerEndringTilTekst,
    årsakMetadataKildeeTilTekst,
    type ÅrsakMetadata,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

export const NyeOpplysningerMetadataVisning: React.FC<{
    årsakMetadata: ÅrsakMetadata;
}> = ({ årsakMetadata }) => {
    const endringer = årsakMetadata.endringer
        .map((endring) => tekstMedFallback(nyeOpplysningerEndringTilTekst, endring))
        .join(', ');

    return (
        <VStack>
            <HStack gap={'space-4'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Kilde:
                </BodyShort>
                <BodyShort size={'small'}>
                    {tekstMedFallback(årsakMetadataKildeeTilTekst, årsakMetadata.kilde)}
                </BodyShort>
            </HStack>
            <HStack gap={'space-4'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Endring:
                </BodyShort>
                <BodyShort size="small">{endringer || '-'}</BodyShort>
            </HStack>
            <HStack gap={'space-4'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Beskrivelse:
                </BodyShort>
                <BodyShort size={'small'}>{årsakMetadata.beskrivelse || '-'}</BodyShort>
            </HStack>
        </VStack>
    );
};
