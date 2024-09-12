import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import BarnDetaljer from './BarnDetaljer';
import Hovedytelse from './Hovedytelse';
import { RevurderingTag } from './RevurderingTag';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { useBehandling } from '../../../../context/BehandlingContext';
import { formaterDato } from '../../../../utils/dato';

const OppsummeringSøknad: React.FC = () => {
    const { behandlingFakta, behandling } = useBehandling();

    return (
        <VStack gap="8">
            <RevurderingTag type={behandling.type} />
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

            {behandlingFakta.barn.map((barn) => {
                const harSøktForBarnet = barn.søknadgrunnlag !== null;
                return harSøktForBarnet && <BarnDetaljer barn={barn} key={barn.barnId} />;
            })}

            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </VStack>
    );
};

export default OppsummeringSøknad;
