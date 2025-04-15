import React from 'react';

import { CalendarIcon, HouseHeartIcon } from '@navikt/aksel-icons';
import { LocationPinIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { BehandlingFaktaBoutgifter } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

const OppsummeringBoutgifter: React.FC<{
    behandlingFakta: BehandlingFaktaBoutgifter;
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

            <InfoSeksjon label="Bostad" ikon={<LocationPinIcon />}>
                <BodyShort size="small">
                    {behandlingFakta.dineOpplysninger.adresse.adresse +
                        behandlingFakta.dineOpplysninger.adresse.postnummer +
                        behandlingFakta.dineOpplysninger.adresse.poststed +
                        behandlingFakta.dineOpplysninger.adresse.landkode}
                </BodyShort>
            </InfoSeksjon>

            <Hovedytelse faktaHovedytelse={behandlingFakta.hovedytelse} />

            {behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold && (
                <ArbeidOgOpphold
                    fakta={behandlingFakta.hovedytelse.søknadsgrunnlag.arbeidOgOpphold}
                />
            )}

            {behandlingFakta.aktiviteter && (
                <Aktivitet aktivitet={behandlingFakta.aktiviteter}></Aktivitet>
            )}
            {behandlingFakta.boligEllerOvernatting && (
                <InfoSeksjon label="bolig og overnatting" ikon={<HouseHeartIcon />}></InfoSeksjon>
            )}
            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </>
    );
};

export default OppsummeringBoutgifter;
