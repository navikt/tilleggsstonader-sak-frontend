import React from 'react';

import { CopyButton, HStack, Label } from '@navikt/ds-react';

export const VerdiMedKopiknapp: React.FC<{ verdi: string }> = ({ verdi }) => (
    <HStack gap="1" align="center">
        <Label>{verdi}</Label>
        <CopyButton copyText={verdi} size="small" />
    </HStack>
);
