import React, { FC } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaOffentligTransport } from '../../typer/faktaReiseTilSamling';

export const LesevisningFaktaOffentligTransport: FC<{
    fakta: FaktaOffentligTransport;
}> = ({ fakta }) => {
    return (
        <VStack gap="space-12" paddingBlock="space-16 space-0">
            <HStack justify={'space-between'}>
                <BodyShort size="small" weight="semibold">
                    {'Utgifter offentlig transport'}
                </BodyShort>
                <BodyShort size="small">
                    {fakta.utgifterOffentligTransport
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.utgifterOffentligTransport)} kr`
                        : '-'}
                </BodyShort>
            </HStack>
            <VStack gap="space-2">
                <BodyShort size="small" weight="semibold">
                    {'Spesifikasjon av utgift'}
                </BodyShort>
                <BodyShort size="small" style={{ whiteSpace: 'pre-wrap' }}>
                    {fakta.begrunnelse || '-'}
                </BodyShort>
            </VStack>
        </VStack>
    );
};
