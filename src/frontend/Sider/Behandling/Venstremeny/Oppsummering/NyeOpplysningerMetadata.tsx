import React from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import {
    nyeOpplysningerEndringTilTekst,
    nyeOpplysningerKildeTilTekst,
    type NyeOpplysningerMetadata,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

export const NyeOpplysningerMetadataVisning: React.FC<{
    nyeOpplysningerMetadata: NyeOpplysningerMetadata;
}> = ({ nyeOpplysningerMetadata }) => {
    const endringer = nyeOpplysningerMetadata.endringer
        .map((endring) => tekstMedFallback(nyeOpplysningerEndringTilTekst, endring))
        .join(', ');

    return (
        <VStack>
            <HStack gap={'space-4'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Kilde:
                </BodyShort>
                <BodyShort size={'small'}>
                    {tekstMedFallback(nyeOpplysningerKildeTilTekst, nyeOpplysningerMetadata.kilde)}
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
                <BodyShort size={'small'}>{nyeOpplysningerMetadata.beskrivelse || '-'}</BodyShort>
            </HStack>
        </VStack>
    );
};
