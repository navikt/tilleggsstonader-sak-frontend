import React from 'react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import AktivitetDagligReise from './AktivitetDagligReise';
import ArbeidOgOpphold from './ArbeidOgOpphold';
import Hovedytelse from './Hovedytelse';
import { ReiseDetaljer } from './ReiseDetlajer/ReiseDetaljer';
import Vedlegg from './Vedlegg';
import { InfoSeksjon, OppsummeringSeksjonsgruppe } from './Visningskomponenter';
import { BehandlingFaktaDagligReise } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../../utils/dato';

export const OppsummeringDagligReise: React.FC<{
    behandlingFakta: BehandlingFaktaDagligReise;
}> = ({ behandlingFakta }) => {
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
                {behandlingFakta.aktiviteter && (
                    <AktivitetDagligReise
                        aktiviteter={behandlingFakta.aktiviteter}
                        layout="grouped"
                    />
                )}
                {behandlingFakta.hovedytelse.søknadsgrunnlag?.arbeidOgOpphold && (
                    <ArbeidOgOpphold
                        fakta={behandlingFakta.hovedytelse.søknadsgrunnlag.arbeidOgOpphold}
                        layout="grouped"
                    />
                )}
            </OppsummeringSeksjonsgruppe>
            {behandlingFakta.reiser && (
                <ReiseDetaljer reiser={behandlingFakta.reiser}></ReiseDetaljer>
            )}
            <Vedlegg fakta={behandlingFakta.dokumentasjon} />
        </>
    );
};
