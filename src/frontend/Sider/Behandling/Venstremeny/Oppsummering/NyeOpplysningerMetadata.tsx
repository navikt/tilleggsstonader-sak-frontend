import React from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import {
    nyeOpplysningerEndringTilTekst,
    nyeOpplysningerKildeTilTekst,
    NyeOpplysningerMetadata,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';

const NyeOpplysningerMetadata: React.FC<{
    nyeOpplysningerMetadata: NyeOpplysningerMetadata;
}> = ({ nyeOpplysningerMetadata }) => {
    const endringer = nyeOpplysningerMetadata.endringer
        .map((endring) => nyeOpplysningerEndringTilTekst[endring])
        .join(', ');

    return (
        <VStack>
            <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Kilde:
                </BodyShort>
                <BodyShort size={'small'}>
                    {nyeOpplysningerKildeTilTekst[nyeOpplysningerMetadata.kilde ?? '-']}
                </BodyShort>
            </HStack>
            <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Endring:
                </BodyShort>
                <BodyShort size="small">{endringer || '-'}</BodyShort>
            </HStack>
            <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Beskrivelse:
                </BodyShort>
                <BodyShort size={'small'}>{nyeOpplysningerMetadata.beskrivelse || '-'}</BodyShort>
            </HStack>
        </VStack>
    );
};
export default NyeOpplysningerMetadata;
