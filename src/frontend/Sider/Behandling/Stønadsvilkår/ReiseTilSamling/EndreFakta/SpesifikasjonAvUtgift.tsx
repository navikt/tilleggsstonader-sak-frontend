import React from 'react';

import { BodyShort, ReadMore, Textarea, VStack } from '@navikt/ds-react';

export const SpesifikasjonAvUtgift: React.FC<{
    value: string;
    error?: string;
    onChange: (value: string) => void;
    pakrevd: boolean;
}> = ({ value, error, onChange, pakrevd }) => (
    <VStack gap="space-4">
        <Textarea
            label={`Spesifikasjon av utgift (${pakrevd ? 'obligatorisk' : 'valgfritt'})`}
            size="small"
            error={error}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        <ReadMore header="Hvordan spesifisere utgift" size="small">
            <BodyShort size="small">
                Beskriv hvordan du har regnet ut beløpet, og hvilke utgiftsposter summen består av.
            </BodyShort>
        </ReadMore>
    </VStack>
);
