import React from 'react';

import { BodyShort, CopyButton, HStack } from '@navikt/ds-react';

import { Operatør } from './Typer/Reisedata';

export const KjøresAv: React.FC<{ operatører: Operatør[] }> = ({ operatører }) => {
    return (
        <HStack gap={'space-8'}>
            <BodyShort>Kjøres av:</BodyShort>
            {operatører
                .filter((operatør) => !operatør.url.includes('nsb.no'))
                .map((operatør, index) => (
                    <HStack gap={'space-4'} key={index}>
                        <BodyShort>{operatør.navn}</BodyShort>
                        <CopyButton size={'xsmall'} copyText={operatør.url} />
                    </HStack>
                ))}
        </HStack>
    );
};
