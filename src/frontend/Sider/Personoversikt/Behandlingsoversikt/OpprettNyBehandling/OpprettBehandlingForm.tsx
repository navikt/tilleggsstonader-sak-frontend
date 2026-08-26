import React, { FC, ReactNode } from 'react';

import { Button, HStack, VStack } from '@navikt/ds-react';

import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Feil } from '../../../../komponenter/Feil/feilmeldingUtils';

interface Props {
    children: ReactNode;
    lukkModal: () => void;
    onSubmit: () => void;
    laster: boolean;
    feilmelding: Feil | undefined;
    disableLagre?: boolean;
}

export const OpprettBehandlingForm: FC<Props> = ({
    children,
    lukkModal,
    onSubmit,
    laster,
    feilmelding,
    disableLagre,
}) => (
    <VStack gap="space-16">
        {children}
        <Feilmelding feil={feilmelding} />
        <HStack gap="space-16" justify={'end'}>
            <Button variant="tertiary" onClick={lukkModal} size="small">
                Avbryt
            </Button>
            <Button
                variant="primary"
                onClick={onSubmit}
                size="small"
                loading={laster}
                disabled={disableLagre}
            >
                Lagre
            </Button>
        </HStack>
    </VStack>
);
