import React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

const BarnetilsynHjelpetekst = () => (
    <ReadMore header={'Slik gjør du vurderingen'} size="small">
        <BodyLong size={'small'} spacing>
            Dersom søker oppgir å ha <strong>overgangsstønad</strong>, men ikke mottar stønaden, må
            du be NAY enslig forsørger (kontornummer 4489) vurdere om søker har rett til
            overgangsstønad. Dersom søker har rett, settes målgruppe overgangsstønad til oppfylt.
        </BodyLong>
        <BodyLong size={'small'} spacing>
            Dersom søker oppgir å ha <strong>omstillingsstønad</strong>, men ikke mottar stønaden,
            må du be Nav Familie- og Pensjonsytelser vurdere om søker har rett til
            omstillingsstønad. Dersom søker har rett, settes målgruppe omstillingsstønad til
            oppfylt. Dersom søker har gjenlevendepensjon, settes målgruppe omstillingsstønad til
            oppfylt. Dersom søker heller ikke har gjenlevendepensjon, må du be Nav Familie- og
            Pensjonsytelser vurdere om inngangsvilkår for tilleggsstønad etter kapittel 17 slik det
            lød før 01.01.24, er oppfylt.
        </BodyLong>
        <BodyLong size={'small'} spacing>
            Dersom søker oppgir <strong>nedsatt arbeidsevne</strong>, men ikke mottar AAP eller
            uføretrygd, må du be Nav-kontoret vurdere om vilkårene for nedsatt arbeidsevne i §11 A-3
            er oppfylt.
        </BodyLong>
        <BodyLong size={'small'}>
            Velg <strong>100% sykepenger</strong> hvis søker mottar sykepenger fra en
            fulltidsstilling.
        </BodyLong>
    </ReadMore>
);

const LæremidlerHjelpetekst = () => (
    <ReadMore header={'Slik gjør du vurderingen'} size="small">
        <BodyLong size={'small'} spacing>
            Dersom søker oppgir å ha <strong>overgangsstønad</strong>, men ikke mottar stønaden, må
            du be NAY enslig forsørger (kontornummer 4489) vurdere om søker har rett til
            overgangsstønad. Dersom søker har rett, settes målgruppe overgangsstønad til oppfylt.
        </BodyLong>
        <BodyLong size={'small'} spacing>
            Dersom søker oppgir å ha <strong>omstillingsstønad</strong>, men ikke mottar stønaden,
            må du be Nav Familie- og Pensjonsytelser vurdere om søker har rett til
            omstillingsstønad. Dersom søker har rett, settes målgruppe omstillingsstønad til
            oppfylt. Dersom søker har gjenlevendepensjon, settes målgruppe omstillingsstønad til
            oppfylt. Dersom søker heller ikke har gjenlevendepensjon, må du be Nav Familie- og
            Pensjonsytelser vurdere om inngangsvilkår for tilleggsstønad etter kapittel 17 slik det
            lød før 01.01.24, er oppfylt.
        </BodyLong>
        <BodyLong size={'small'} spacing>
            Dersom søker oppgir <strong>nedsatt arbeidsevne</strong>, men ikke mottar AAP eller
            uføretrygd, må du be Nav-kontoret vurdere om vilkårene for nedsatt arbeidsevne i §11 A-3
            er oppfylt.
        </BodyLong>
        <BodyLong size={'small'}>
            Hvis søker mottar <strong>sykepenger</strong>, men ikke har AAP eller uføretrygd, skal
            du sjekke om søker har nedsatt arbeidsevne etter §11 A-3.
        </BodyLong>
    </ReadMore>
);

export const MålgruppeHjelpetekst = () => {
    const { behandling } = useBehandling();
    if (behandling.stønadstype === Stønadstype.LÆREMIDLER) return <LæremidlerHjelpetekst />;
    return <BarnetilsynHjelpetekst />;
};
