import React from 'react';

import { Heading, VStack } from '@navikt/ds-react';

import { LagretKjørelisteKort } from './LagretKjørelisteKort';
import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';

export const LagredeKjørelister: React.FC = () => {
    const { kjørelisterLagretIBehandling } = useRegistrerKjøreliste();

    if (kjørelisterLagretIBehandling.length === 0) {
        return null;
    }

    return (
        <VStack gap="space-16">
            <Heading size="medium">Kjørelister registrert i denne behandlingen</Heading>
            {kjørelisterLagretIBehandling.map((reise) => (
                <LagretKjørelisteKort key={reise.id} kjøreliste={reise} />
            ))}
        </VStack>
    );
};
