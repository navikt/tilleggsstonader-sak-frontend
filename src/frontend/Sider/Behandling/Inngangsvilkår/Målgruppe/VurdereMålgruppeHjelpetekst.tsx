import React from 'react';

import styled from 'styled-components';

import { ReadMore } from '@navikt/ds-react';

import { MålgruppeType } from '../typer/målgruppe';

const LesMerTekst = styled(ReadMore)`
    max-width: 30rem;
`;

const nedsattArbeidsevne =
    'Se rundskriv til folketrygdloven kapittel 2. ' +
    'Du må først vurdere om søker er medlem i et annet lands trygdeordning (lovvalg). ' +
    'Dersom søker ikke er medlem i et annet land, ' +
    'må du vurder om vilkårene i folketrygdloven kapittel 2 er oppfylt.';

const uføretrygd =
    'Uføretrygd kan gis til personer som ikke er medlem i folketrygden. ' +
    'Dersom uføretrygden er gitt etter unntaksreglene i § 12-3 andre ledd, ' +
    'kan tilleggsstønader ikke gis fordi medlemskapsvilkåret ikke er oppfylt. ' +
    'Du må derfor innhente medlemskapsstatus fra NAV Arbeid og ytelser.';

const gjenlevende =
    'Gjenlevendeytelser kan gis til personer som ikke er medlem i folketrygden. ' +
    'Dersom gjenlevendepensjon/omstillingsstønad er gitt etter unntaksreglene i § 17-3 andre ledd, ' +
    'kan tilleggsstønader ikke gis fordi medlemskapsvilkåret ikke er oppfylt. ' +
    'Du må derfor innhente medlemskapsstatus fra NAV Familie og pensjonsytelser.';

export const VurdereMålgruppeHjelpetekst = (props: { type: MålgruppeType }) => {
    let tekst: string;
    switch (props.type) {
        case MålgruppeType.NEDSATT_ARBEIDSEVNE:
            tekst = nedsattArbeidsevne;
            break;
        case MålgruppeType.UFØRETRYGD:
            tekst = uføretrygd;
            break;
        case MålgruppeType.OMSTILLINGSSTØNAD:
            tekst = gjenlevende;
            break;
        default:
            return undefined;
    }

    return (
        <LesMerTekst header={'Slik vurderer du medlemskap'} size={'small'}>
            {tekst}
        </LesMerTekst>
    );
};
