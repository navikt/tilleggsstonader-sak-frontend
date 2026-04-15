import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import BarnDetaljer from './BarnDetaljer';
import Hovedytelse from './Hovedytelse';
import Vedlegg from './Vedlegg';
import { InfoSeksjon, OppsummeringSeksjonsgruppe } from './Visningskomponenter';
import { BehandlingFaktaTilsynBarn } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

const OppsummeringTilsynBarn: React.FC<{
    behandlingFakta: BehandlingFaktaTilsynBarn;
}> = ({ behandlingFakta }) => {
    const barnDetSøkesFor = behandlingFakta.barn.filter((barn) => barn.søknadgrunnlag != null);

    return (
        <>
            <OppsummeringSeksjonsgruppe>
                {behandlingFakta.søknadMottattTidspunkt && (
                    <InfoSeksjon label="Søknadsdato" ikon={<CalendarIcon />} layout="grouped">
                        <BodyShort size="small">
                            {formaterDato(behandlingFakta.søknadMottattTidspunkt)}
                        </BodyShort>
                    </InfoSeksjon>
                )}
                <Hovedytelse faktaHovedytelse={behandlingFakta.hovedytelse} layout="grouped" />
                {behandlingFakta.aktivitet && (
                    <Aktivitet aktivitet={behandlingFakta.aktivitet} layout="grouped"></Aktivitet>
                )}
                {behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold && (
                    <ArbeidOgOpphold
                        fakta={behandlingFakta.hovedytelse.søknadsgrunnlag.arbeidOgOpphold}
                        layout="grouped"
                    />
                )}
            </OppsummeringSeksjonsgruppe>

            {barnDetSøkesFor.length > 0 && (
                <VStack gap="space-12">
                    {barnDetSøkesFor.map((barn, index) => (
                        <BarnDetaljer barn={barn} defaultOpen={index === 0} key={barn.barnId} />
                    ))}
                </VStack>
            )}

            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </>
    );
};

export default OppsummeringTilsynBarn;
