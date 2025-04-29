import React from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { OppsummeringBoutgifter } from './OppsummeringBoutgifter';
import OppsummeringLæremidler from './OppsummeringLæremidler';
import OppsummeringTilsynBarn from './OppsummeringTilsynBarn';
import { RevurderingTag } from './RevurderingTag';
import { StønadstypeTag } from './StønadstypeTag';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

const OppsummeringSøknad: React.FC = () => {
    const { behandlingFakta, behandling } = useBehandling();
    return (
        <VStack gap="8">
            <HStack gap="2">
                <StønadstypeTag stønadstype={behandling.stønadstype} />
                <RevurderingTag behandling={behandling} />
            </HStack>
            {behandlingFakta['@type'] === Stønadstype.BARNETILSYN && (
                <OppsummeringTilsynBarn behandlingFakta={behandlingFakta} />
            )}
            {behandlingFakta['@type'] === Stønadstype.LÆREMIDLER && (
                <OppsummeringLæremidler behandlingFakta={behandlingFakta} />
            )}
            {behandlingFakta['@type'] === Stønadstype.BOUTGIFTER && (
                <OppsummeringBoutgifter behandlingFakta={behandlingFakta} />
            )}
        </VStack>
    );
};

export default OppsummeringSøknad;
