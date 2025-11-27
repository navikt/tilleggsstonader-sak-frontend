import React from 'react';

import { BodyShort, CopyButton, HStack } from '@navikt/ds-react';

import { Operatør } from './Reisedata';

export const KjøresAv: React.FC<{ operatører: Operatør[] }> = ({ operatører }) => {
    return (
        <HStack gap={'2'}>
            <BodyShort>Kjøres av:</BodyShort>
            {operatører.map((operatør, index) => (
                <HStack gap={'1'} key={index}>
                    <BodyShort>{operatør.navn}</BodyShort>
                    <CopyButton size={'xsmall'} copyText={operatør.url} />
                </HStack>
            ))}
        </HStack>
    );
};
