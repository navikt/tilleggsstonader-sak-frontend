import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import AktivitetDagligReise from './AktivitetDagligReise';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import { ReiseDetajler } from './ReiseDetlajer/ReiseDetajler';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { BehandlingFaktaDagligReise } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

export const OppsummeringDagligReise: React.FC<{
    behandlingFakta: BehandlingFaktaDagligReise;
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
                <AktivitetDagligReise
                    aktiviteter={behandlingFakta.aktiviteter}
                ></AktivitetDagligReise>
            )}
            {behandlingFakta.reiser && (
                <ReiseDetajler reiser={behandlingFakta.reiser}></ReiseDetajler>
            )}
            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </>
    );
};
