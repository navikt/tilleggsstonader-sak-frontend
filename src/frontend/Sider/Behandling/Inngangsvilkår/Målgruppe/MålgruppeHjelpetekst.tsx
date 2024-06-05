import React from 'react';

import { ReadMore } from '@navikt/ds-react';

export const MålgruppeHjelpetekst = () => (
    <ReadMore header={'Slik gjør du vurderingen'}>
        <p>
            Dersom søker oppgir å ha <strong>overgangsstønad</strong>, men ikke mottar stønaden, må
            du be NAY enslig forsørger (kontornummer 4489) vurdere om søker har rett til
            overgangsstønad. Dersom søker har rett, settes målgruppe overgangsstønad til oppfylt.
        </p>
        <p>
            Dersom søker oppgir å ha <strong>omstillingsstønad</strong>, men ikke mottar stønaden,
            må du be NAV Familie- og Pensjonsytelser vurdere om søker har rett til
            omstillingsstønad. Dersom søker har rett, settes målgruppe omstillingsstønad til
            oppfylt. Dersom søker ikke har eller har rett til omstillingsstønad, må du kontrollere
            om det utbetales gjenlevendepensjon. Dersom søker har gjenlevendepensjon, settes
            målgruppe omstillingsstønad til oppfylt. Dersom søker heller ikke har
            gjenlevendepensjon, må du be NAV Familie- og Pensjonsytelser vurdere om inngangsvilkår
            for tilleggsstønad etter kapittel 17 slik det lød før 01.01.24, er oppfylt.
        </p>
        <p>
            Dersom søker oppgir <strong>nedsatt arbeidsevne</strong>, men ikke mottar AAP eller
            uføretrygd, må du be NAV- kontoret vurdere om vilkårene for nedsatt arbeidsevne i § 11
            A-3 er oppfylt.
        </p>
        <p>
            <strong>100% sykepenger</strong> gjelder hvis søker er sykemeldt fra 100%
            fulltidsstilling eller fra fast deltidsstilling hvor søker ikke har annen inntekt eller
            ytelse fra NAV. F.eks. hvis søker er i 70% stilling og mottar 100% sykepenger for denne
            stillingen.
        </p>
    </ReadMore>
);
