import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import { SøknadInfoSeksjon } from './Visningskomponenter';
import { FaktaSamling } from '../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { formaterDato } from '../../../../utils/dato';

export const Samlinger: React.FC<{ samlinger?: FaktaSamling[] }> = ({ samlinger }) => {
    if (!samlinger || samlinger.length === 0) return null;

    return (
        <SøknadInfoSeksjon label="Samlinger" ikon={<CalendarIcon />}>
            <VStack gap="space-8">
                {samlinger.map((s, index) => (
                    <BodyShort size="small" key={index}>
                        {formaterDato(s.fom)} – {formaterDato(s.tom)}
                    </BodyShort>
                ))}
            </VStack>
        </SøknadInfoSeksjon>
    );
};
