import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import BarnDetaljer from './BarnDetaljer';
import Hovedytelse from './Hovedytelse';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { useBehandling } from '../../../../context/BehandlingContext';
import { formaterDato } from '../../../../utils/dato';

const Oppsummering: React.FC = () => {
    const { behandlingFakta } = useBehandling();

    return (
        <VStack gap="8">
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

            <Aktivitet aktivitet={behandlingFakta.aktivitet}></Aktivitet>

            {behandlingFakta.barn.map((barn) => (
                <BarnDetaljer barn={barn} key={barn.barnId} />
            ))}

            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </VStack>
    );
};

export default Oppsummering;
