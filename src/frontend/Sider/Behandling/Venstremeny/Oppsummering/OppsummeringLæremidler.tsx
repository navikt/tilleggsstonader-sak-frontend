import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import Utdanning from './Utdanning';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { BehandlingFaktaLæremidler } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

const OppsummeringLæremidler: React.FC<{
    behandlingFakta: BehandlingFaktaLæremidler;
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
            <Utdanning faktaUtdanning={behandlingFakta.utdanning} />
            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </>
    );
};

export default OppsummeringLæremidler;
