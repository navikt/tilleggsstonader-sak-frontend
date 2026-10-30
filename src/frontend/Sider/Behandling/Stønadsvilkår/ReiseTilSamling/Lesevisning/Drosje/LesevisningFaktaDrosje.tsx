import React, { FC } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import begrunnelseStyles from '../../../../../../komponenter/Begrunnelse.module.css';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../../../utils/fomatering';
import { LesevisningNødvendigUtgift } from '../../../Felles/Lesevisning/LesevisningNødvendigUtgift';
import { FaktaDrosje } from '../../typer/faktaReiseTilSamling';

export const LesevisningFaktaDrosje: FC<{
    fakta: FaktaDrosje;
}> = ({ fakta }) => {
    return (
        <VStack gap="space-12" paddingBlock="space-16 space-0">
            <LesevisningNødvendigUtgift nødvendigUtgift={fakta.nødvendigUtgift} />

            <HStack justify="space-between">
                <BodyShort size="small" weight="semibold">
                    {'Utgifter til drosje'}
                </BodyShort>
                <BodyShort size="small">
                    {fakta.utgifterDrosje
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.utgifterDrosje)} kr`
                        : '-'}
                </BodyShort>
            </HStack>
            <VStack gap="space-2">
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
