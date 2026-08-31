import React, { FC } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaOffentligTransport } from '../../typer/faktaReiseTilSamling';

export const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport | undefined;
}> = ({ fakta }) => {
    return (
        <VStack gap="space-4" paddingBlock="space-16 space-0">
            <HStack justify={'space-between'}>
                <BodyShort size="small">{'Utgifter offentlig transport'}</BodyShort>
                <BodyShort size="small">
                    {fakta?.utgifterOffentligTransport
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.utgifterOffentligTransport)} kr`
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
