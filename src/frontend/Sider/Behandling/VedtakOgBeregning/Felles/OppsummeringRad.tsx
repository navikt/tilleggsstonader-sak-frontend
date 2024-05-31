import React, { FC } from 'react';

import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import { AIconDanger, AIconSuccess } from '@navikt/ds-tokens/dist/tokens';

const OppsummeringRad: FC<{ tekst: string; vilkårOppfylt: boolean }> = ({
    tekst,
    vilkårOppfylt,
}) => {
    return (
        <HStack gap="1">
            {vilkårOppfylt ? (
                <CheckmarkCircleFillIcon color={AIconSuccess} />
            ) : (
                <XMarkOctagonFillIcon color={AIconDanger} />
            )}
            <BodyShort size="small">{tekst}</BodyShort>
        </HStack>
    );
};

export default OppsummeringRad;
