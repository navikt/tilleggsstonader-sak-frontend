import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { BehandlingFaktaReiseTilSamling } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
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
