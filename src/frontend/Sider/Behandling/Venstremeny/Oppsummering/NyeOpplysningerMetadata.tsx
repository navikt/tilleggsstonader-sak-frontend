import React from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import {
    nyeOpplysningerEndringTilTekst,
    NyeOpplysningerMetadata,
} from '../../../../typer/behandling/nyeOpplysningerMetadata';

const NyeOpplysningerMetadata: React.FC<{
    nyeOpplysningerMetadata: NyeOpplysningerMetadata;
}> = ({ nyeOpplysningerMetadata }) => {
    const endringerVisning = (() => {
        if (nyeOpplysningerMetadata.endringer.length === 1) {
            return (
                <BodyShort size="small">
                    {nyeOpplysningerEndringTilTekst[nyeOpplysningerMetadata.endringer[0]]}
                </BodyShort>
            );
        }

        return nyeOpplysningerMetadata.endringer.map((endring, index) => {
            const isLast = index === nyeOpplysningerMetadata.endringer.length - 1;
            return (
                <BodyShort key={index} size="small">
                    {nyeOpplysningerEndringTilTekst[endring]}
                    {!isLast && ','}
                </BodyShort>
            );
        });
    })();

    return (
        <VStack>
            <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Kilde:
                </BodyShort>
                <BodyShort size={'small'}>{nyeOpplysningerMetadata.kilde}</BodyShort>
            </HStack>
            <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Endring:
                </BodyShort>
                {endringerVisning}
            </HStack>
            <HStack gap={'1'}>
                <BodyShort size={'small'} weight={'semibold'}>
                    Beskrivelse:
                </BodyShort>
                <BodyShort size={'small'}>
                    {nyeOpplysningerMetadata.beskrivelse
                        ? nyeOpplysningerMetadata.beskrivelse
                        : '-'}
                </BodyShort>
            </HStack>
        </VStack>
    );
};
export default NyeOpplysningerMetadata;
