import React, { FC } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import begrunnelseStyles from '../../../../../../komponenter/Begrunnelse.module.css';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { FaktaPrivatBil } from '../../typer/faktaReiseTilSamling';
import { LesevisningNødvendigUtgift } from '../Felles/LesevisningNødvendigUtgift';

export const LesevisningFaktaPrivatBil: FC<{
    fakta: FaktaPrivatBil;
}> = ({ fakta }) => {
    return (
        <VStack gap="space-16" paddingBlock="space-16 space-0">
            <LesevisningNødvendigUtgift nødvendigUtgift={fakta.nødvendigUtgift} />

            <VStack gap="space-8">
                <HStack justify={'space-between'}>
                    <BodyShort size="small" weight="semibold">
                        {'Reiseavstand i km'}
                    </BodyShort>
                    <BodyShort size="small">
                        {fakta.reiseavstand
                            ? `${formaterTallMedTusenSkilleEllerStrek(fakta.reiseavstand)} km`
                            : '-'}
                    </BodyShort>
                </HStack>

                {fakta.bompenger && (
                    <HStack justify={'space-between'}>
                        <BodyShort size="small" weight="semibold">
                            {'Bompenger'}
                        </BodyShort>
                        <BodyShort size="small">
                            {`${formaterTallMedTusenSkilleEllerStrek(fakta.bompenger)} kr`}
                        </BodyShort>
                    </HStack>
                )}

                {fakta.fergekostnad && (
                    <HStack justify={'space-between'}>
                        <BodyShort size="small" weight="semibold">
                            {'Fergekostnad'}
                        </BodyShort>
                        <BodyShort size="small">
                            {`${formaterTallMedTusenSkilleEllerStrek(fakta.fergekostnad)} kr`}
                        </BodyShort>
                    </HStack>
                )}

                {fakta.parkering && (
                    <HStack justify={'space-between'}>
                        <BodyShort size="small" weight="semibold">
                            {'Parkering'}
                        </BodyShort>
                        <BodyShort size="small">
                            {`${formaterTallMedTusenSkilleEllerStrek(fakta.parkering)} kr`}
                        </BodyShort>
                    </HStack>
                )}

                {fakta.piggdekkavgift && (
                    <HStack justify={'space-between'}>
                        <BodyShort size="small" weight="semibold">
                            {'Piggdekkavgift'}
                        </BodyShort>
                        <BodyShort size="small">
                            {`${formaterTallMedTusenSkilleEllerStrek(fakta.piggdekkavgift)} kr`}
                        </BodyShort>
                    </HStack>
                )}
            </VStack>

            <VStack gap="space-2" paddingBlock="space-8 space-0">
                <BodyShort size="small" weight="semibold">
                    {'Spesifikasjon av utgift'}
                </BodyShort>
                <BodyShort size="small" className={begrunnelseStyles.bevarLinjeskift}>
                    {fakta.begrunnelse || '-'}
                </BodyShort>
            </VStack>
        </VStack>
    );
};
