import React, { useCallback, useEffect, useState } from 'react';

import { VStack } from '@navikt/ds-react';

import BarnDetaljer from './BarnDetaljer';
import Vedlegg from './Vedlegg';
import { Informasjonskilde, Informasjonsrad, InfoSeksjon } from './Visningskomponenter';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { BehandlingFakta } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import {
    boddSammenhengendeMapping,
    planleggerBoINorgeNeste12mndMapping,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { JaNei } from '../../../../typer/common';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';

const Oppsummering: React.FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [behandlingFakta, settBehandlingFakta] =
        useState<Ressurs<BehandlingFakta>>(byggTomRessurs());

    const hentBehandlingFaktaCallback = useCallback(() => {
        request<BehandlingFakta, null>(`/api/sak/behandling/${behandling.id}/fakta`).then(
            settBehandlingFakta
        );
    }, [request, behandling.id]);

    useEffect(hentBehandlingFaktaCallback, [hentBehandlingFaktaCallback]);

    return (
        <DataViewer response={{ behandlingFakta }}>
            {({ behandlingFakta }) => (
                <VStack gap="8">
                    <InfoSeksjon label="Ytelse/situasjon">
                        <Informasjonsrad
                            kilde={Informasjonskilde.SØKNAD}
                            verdi={behandlingFakta.hovedytelse.søknadsgrunnlag?.hovedytelse?.join(
                                ', '
                            )}
                        />
                        {behandlingFakta.hovedytelse.søknadsgrunnlag?.boddSammenhengende && (
                            <Informasjonsrad
                                kilde={Informasjonskilde.SØKNAD}
                                verdi={
                                    boddSammenhengendeMapping[
                                        behandlingFakta.hovedytelse.søknadsgrunnlag
                                            .boddSammenhengende
                                    ]
                                }
                            />
                        )}
                        {behandlingFakta.hovedytelse.søknadsgrunnlag
                            ?.planleggerBoINorgeNeste12mnd && (
                            <Informasjonsrad
                                kilde={Informasjonskilde.SØKNAD}
                                verdi={
                                    planleggerBoINorgeNeste12mndMapping[
                                        behandlingFakta.hovedytelse.søknadsgrunnlag
                                            .planleggerBoINorgeNeste12mnd
                                    ]
                                }
                            />
                        )}
                    </InfoSeksjon>

                    <InfoSeksjon label="Aktivitet">
                        {/* TODO: Legg inn andre aktiviteter*/}
                        <Informasjonsrad
                            kilde={Informasjonskilde.SØKNAD}
                            verdi={
                                behandlingFakta.aktivitet.søknadsgrunnlag?.utdanning === JaNei.JA
                                    ? 'Utdanning'
                                    : undefined
                            }
                        />
                    </InfoSeksjon>

                    {behandlingFakta.barn.map((barn) => (
                        <BarnDetaljer barn={barn} key={barn.barnId} />
                    ))}

                    <Vedlegg fakta={behandlingFakta.dokumentasjon} />
                </VStack>
            )}
        </DataViewer>
    );
};

export default Oppsummering;
