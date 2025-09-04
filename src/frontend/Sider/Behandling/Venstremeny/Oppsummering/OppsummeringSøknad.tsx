import React from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import NyeOpplysningerMetadata from './NyeOpplysningerMetadata';
import { OppsummeringBoutgifter } from './OppsummeringBoutgifter';
import { OppsummeringDagligReise } from './OppsummeringDagligReise';
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
            <VStack gap={'4'}>
                <HStack gap="2">
                    <StønadstypeTag stønadstype={behandling.stønadstype} />
                    <RevurderingTag behandling={behandling} />
                </HStack>
                {behandling.nyeOpplysningerMetadata && (
                    <NyeOpplysningerMetadata
                        nyeOpplysningerMetadata={behandling.nyeOpplysningerMetadata}
                    />
                )}
            </VStack>
            {behandlingFakta['@type'] === Stønadstype.BARNETILSYN && (
                <OppsummeringTilsynBarn behandlingFakta={behandlingFakta} />
            )}
            {behandlingFakta['@type'] === Stønadstype.LÆREMIDLER && (
                <OppsummeringLæremidler behandlingFakta={behandlingFakta} />
            )}
            {behandlingFakta['@type'] === Stønadstype.BOUTGIFTER && (
                <OppsummeringBoutgifter behandlingFakta={behandlingFakta} />
            )}
            {behandlingFakta['@type'] === Stønadstype.DAGLIG_REISE_TSO && (
                <OppsummeringDagligReise behandlingFakta={behandlingFakta} />
            )}
            {behandlingFakta['@type'] === Stønadstype.DAGLIG_REISE_TSR && (
                <OppsummeringDagligReise behandlingFakta={behandlingFakta} />
            )}
        </VStack>
    );
};

export default OppsummeringSøknad;
