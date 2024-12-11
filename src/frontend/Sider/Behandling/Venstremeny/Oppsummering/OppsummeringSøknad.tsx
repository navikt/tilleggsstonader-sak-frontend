import React from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import OppsummeringLæremidler from './OppsummeringLæremidler';
import OppsummeringTilsynBarn from './OppsummeringTilsynBarn';
import { RevurderingTag } from './RevurderingTag';
import { StonadstypeTag } from './StønadstypeTag';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

const OppsummeringSøknad: React.FC = () => {
    const { behandlingFakta, behandling } = useBehandling();
    return (
        <VStack gap="8">
            <HStack gap="4">
                <StonadstypeTag behandling={behandling} />
                <RevurderingTag behandling={behandling} />
            </HStack>
            {behandlingFakta['@type'] === Stønadstype.BARNETILSYN && (
                <OppsummeringTilsynBarn behandlingFakta={behandlingFakta} />
            )}
            {behandlingFakta['@type'] === Stønadstype.LÆREMIDLER && (
                <OppsummeringLæremidler behandlingFakta={behandlingFakta} />
            )}
        </VStack>
    );
};

export default OppsummeringSøknad;
