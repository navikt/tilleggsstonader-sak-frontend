import React, { FC } from 'react';

import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import { BgDangerStrong, BgWarningStrong } from '@navikt/ds-tokens/darkside-js';

const OppsummeringRad: FC<{ tekst: string; vilkårOppfylt: boolean }> = ({
    tekst,
    vilkårOppfylt,
}) => {
    return (
        <HStack gap="1">
            {vilkårOppfylt ? (
                <CheckmarkCircleFillIcon color={BgDangerStrong} />
            ) : (
                <XMarkOctagonFillIcon color={BgWarningStrong} />
            )}
            <BodyShort size="small">{tekst}</BodyShort>
        </HStack>
    );
};

export default OppsummeringRad;
