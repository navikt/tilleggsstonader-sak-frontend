import React, { FC } from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { FanePath } from '../../../faner';

export const KjørelisteFane: FC = () => {
    return (
        <VStack gap="6">
            <BodyShort size="small">
                Her kommer informasjon om rammevedtak for kjøring med privat bil 🚗
            </BodyShort>
            <StegKnapp steg={Steg.KJØRELISTE} nesteFane={FanePath.BEREGNING}>
                Ferdigstill steg
            </StegKnapp>
        </VStack>
    );
};
