import React, { FC } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaPrivatBil } from '../../typer/faktaReiseTilSamling';

export const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <VStack gap="space-4" paddingBlock="space-16 space-0">
            <HStack justify={'space-between'}>
                <BodyShort size="small">{'Reiseavstand i km'}</BodyShort>
                <BodyShort size="small">
                    {fakta?.reiseavstand
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.reiseavstand)} km`
                        : '-'}
                </BodyShort>
            </HStack>

            <HStack justify={'space-between'}>
                <BodyShort size="small">{'Bompenger'}</BodyShort>
                <BodyShort size="small">
                    {fakta?.bompenger
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.bompenger)} kr`
                        : '-'}
                </BodyShort>
            </HStack>

            <HStack justify={'space-between'}>
                <BodyShort size="small">{'Fergekostnad'}</BodyShort>
                <BodyShort size="small">
                    {fakta?.fergekostnad
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.fergekostnad)} kr`
                        : '-'}
                </BodyShort>
            </HStack>

            <HStack justify={'space-between'}>
                <BodyShort size="small">{'Parkering'}</BodyShort>
                <BodyShort size="small">
                    {fakta?.parkering
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.parkering)} kr`
                        : '-'}
                </BodyShort>
            </HStack>

            {fakta?.aktivitetId && (
                <HStack justify={'space-between'}>
                    <BodyShort size="small">{'Aktivitet'}</BodyShort>
                    <BodyShort size="small">{fakta.aktivitetId}</BodyShort>
                </HStack>
            )}
        </VStack>
    );
};
