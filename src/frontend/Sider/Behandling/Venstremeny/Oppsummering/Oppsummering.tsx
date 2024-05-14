import React from 'react';

import { VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import BarnDetaljer from './BarnDetaljer';
import Vedlegg from './Vedlegg';
import { Informasjonskilde, Informasjonsrad, InfoSeksjon } from './Visningskomponenter';
import { useBehandling } from '../../../../context/BehandlingContext';
import { hovedytelseTilTekst } from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const Oppsummering: React.FC = () => {
    const { behandlingFakta } = useBehandling();

    return (
        <VStack gap="8">
            <InfoSeksjon label="Ytelse/situasjon">
                <Informasjonsrad
                    kilde={Informasjonskilde.SØKNAD}
                    verdi={behandlingFakta.hovedytelse.søknadsgrunnlag?.hovedytelse
                        ?.map((hovedytelse) => tekstEllerKode(hovedytelseTilTekst, hovedytelse))
                        ?.join(', ')}
                />
            </InfoSeksjon>
            {behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold && (
                <InfoSeksjon label={'Arbeid og opphold'}>
                    <ArbeidOgOpphold
                        fakta={behandlingFakta.hovedytelse.søknadsgrunnlag.arbeidOgOpphold}
                    />
                </InfoSeksjon>
            )}

            <InfoSeksjon label="Aktivitet">
                {/* TODO: Legg inn info om aktiviteter*/}
                <Aktivitet aktivitet={behandlingFakta.aktivitet}></Aktivitet>
            </InfoSeksjon>

            {behandlingFakta.barn.map((barn) => (
                <BarnDetaljer barn={barn} key={barn.barnId} />
            ))}

            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </VStack>
    );
};

export default Oppsummering;
