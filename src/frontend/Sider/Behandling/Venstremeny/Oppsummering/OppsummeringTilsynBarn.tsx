import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import BarnDetaljer from './BarnDetaljer';
import Hovedytelse from './Hovedytelse';
import Vedlegg from './Vedlegg';
import { InfoSeksjon } from './Visningskomponenter';
import { BehandlingFaktaTilsynBarn } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

const OppsummeringTilsynBarn: React.FC<{
    behandlingFakta: BehandlingFaktaTilsynBarn;
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

            {behandlingFakta.aktivitet && (
                <Aktivitet aktivitet={behandlingFakta.aktivitet}></Aktivitet>
            )}

            {behandlingFakta.barn &&
                behandlingFakta.barn.map((barn) => {
                    const harSøktForBarnet = barn.søknadgrunnlag !== null;
                    return harSøktForBarnet && <BarnDetaljer barn={barn} key={barn.barnId} />;
                })}

            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </>
    );
};

export default OppsummeringTilsynBarn;
