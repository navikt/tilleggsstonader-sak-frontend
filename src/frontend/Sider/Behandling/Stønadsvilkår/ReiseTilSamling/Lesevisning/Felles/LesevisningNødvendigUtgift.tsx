import React, { FC } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { jaNeiTilTekst } from '../../../../../../typer/common';
import { NødvendigUtgift } from '../../typer/faktaReiseTilSamling';

export const LesevisningNødvendigUtgift: FC<{
    nødvendigUtgift: NødvendigUtgift | undefined;
}> = ({ nødvendigUtgift }) => {
    if (!nødvendigUtgift) {
        return null;
    }

    return (
        <VStack gap="space-8" paddingBlock="space-16 space-0">
            <HStack justify={'space-between'}>
                <BodyShort size="small" weight="semibold">
                    Nødvendig utgift
                </BodyShort>
                <BodyShort size="small">
                    {jaNeiTilTekst[nødvendigUtgift.erUtgiftenNødvendig]}
                </BodyShort>
            </HStack>
            {nødvendigUtgift.erUtgiftenNødvendig === 'NEI' && (
                <BodyShort size="small" style={{ whiteSpace: 'pre-wrap' }}>
                    {nødvendigUtgift.begrunnelse || '-'}
                </BodyShort>
            )}
        </VStack>
    );
};
