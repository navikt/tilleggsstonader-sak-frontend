import React from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { NyeOpplysningerMetadataVisning } from './NyeOpplysningerMetadata';
import { OppsummeringBoutgifter } from './OppsummeringBoutgifter';
import { OppsummeringDagligReise } from './OppsummeringDagligReise';
import { OppsummeringLæremidler } from './OppsummeringLæremidler';
import { OppsummeringReiseTilSamling } from './OppsummeringReiseTilSamling';
import { OppsummeringTilsynBarn } from './OppsummeringTilsynBarn';
import { RevurderingTag } from './RevurderingTag';
import { StønadstypeTag } from './StønadstypeTag';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

export const OppsummeringSøknad: React.FC = () => {
    const { behandlingFakta, behandling } = useBehandling();

    return (
        <VStack gap="space-16">
            <VStack gap={'space-12'}>
                <HStack gap="space-8" wrap>
                    <StønadstypeTag stønadstype={behandling.stønadstype} />
                    <RevurderingTag behandling={behandling} />
                </HStack>
                {behandling.nyeOpplysningerMetadata && (
                    <NyeOpplysningerMetadataVisning
                        nyeOpplysningerMetadata={behandling.nyeOpplysningerMetadata}
                    />
                )}
            </VStack>
            {behandlingFakta['@type'] === Stønadstype.BARNETILSYN && (
                <OppsummeringTilsynBarn behandlingFakta={behandlingFakta} key={behandling.id} />
            )}
            {behandlingFakta['@type'] === Stønadstype.LÆREMIDLER && (
                <OppsummeringLæremidler behandlingFakta={behandlingFakta} key={behandling.id} />
            )}
            {behandlingFakta['@type'] === Stønadstype.BOUTGIFTER && (
                <OppsummeringBoutgifter behandlingFakta={behandlingFakta} key={behandling.id} />
            )}
            {(behandlingFakta['@type'] === Stønadstype.DAGLIG_REISE_TSO ||
                behandlingFakta['@type'] === Stønadstype.DAGLIG_REISE_TSR) && (
                <OppsummeringDagligReise behandlingFakta={behandlingFakta} key={behandling.id} />
            )}
            {behandlingFakta['@type'] === Stønadstype.REISE_TIL_SAMLING_TSO && (
                <OppsummeringReiseTilSamling
                    behandlingFakta={behandlingFakta}
                    key={behandling.id}
                />
            )}
        </VStack>
    );
};
