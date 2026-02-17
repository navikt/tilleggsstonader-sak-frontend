import React from 'react';

import { CopyButton, HStack, Label, Tooltip } from '@navikt/ds-react';

export const InlineKopiknapp: React.FC<{ kopitekst: string; tooltipTekst: string }> = ({
    kopitekst,
    tooltipTekst,
}) => (
    <HStack gap="space-4" align="center">
        <Label>{kopitekst}</Label>
        <Tooltip content={tooltipTekst}>
            <CopyButton copyText={kopitekst} size="small" />
        </Tooltip>
    </HStack>
);
