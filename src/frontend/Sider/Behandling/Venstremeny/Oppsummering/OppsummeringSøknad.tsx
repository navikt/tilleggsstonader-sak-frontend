import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import NyeOpplysningerMetadata from './NyeOpplysningerMetadata';
import { OppsummeringBoutgifter } from './OppsummeringBoutgifter';
import { OppsummeringDagligReise } from './OppsummeringDagligReise';
import OppsummeringLæremidler from './OppsummeringLæremidler';
import OppsummeringTilsynBarn from './OppsummeringTilsynBarn';
import { RevurderingTag } from './RevurderingTag';
import { StønadstypeTag } from './StønadstypeTag';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { useBehandling } from '../../../../context/BehandlingContext';
import { BehandlingFaktaReiseTilSamling } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { formaterDato } from '../../../../utils/dato';

export const OppsummeringReiseTilSamling: React.FC<{
    behandlingFakta: BehandlingFaktaReiseTilSamling;
}> = ({ behandlingFakta }) => {
    return (
        <>
            {behandlingFakta.søknadMottattTidspunkt && (
                <InfoSeksjon label="Søknadsdato" ikon={<CalendarIcon />}>
                    <BodyShort size="small">
                        {formaterDato(behandlingFakta.søknadMottattTidspunkt)}
                    </BodyShort>
                </InfoSeksjon>
            )}
            <Hovedytelse faktaHovedytelse={behandlingFakta.hovedytelse} />

            {behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold && (
                <ArbeidOgOpphold
                    fakta={behandlingFakta.hovedytelse.søknadsgrunnlag.arbeidOgOpphold}
                />
            )}

            {behandlingFakta.aktiviteter && (
                <Aktivitet aktivitet={behandlingFakta.aktiviteter}></Aktivitet>
            )}

            {/*TODO: resten av tingene*/}
            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </>
    );
};

export const OppsummeringSøknad: React.FC = () => {
    const { behandlingFakta, behandling } = useBehandling();

    return (
        <VStack gap="space-32">
            <VStack gap={'space-16'}>
                <HStack gap="space-8">
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
            {behandlingFakta['@type'] === Stønadstype.REISE_TIL_SAMLING_TSO && (
                <OppsummeringReiseTilSamling behandlingFakta={behandlingFakta} />
            )}
        </VStack>
    );
};
