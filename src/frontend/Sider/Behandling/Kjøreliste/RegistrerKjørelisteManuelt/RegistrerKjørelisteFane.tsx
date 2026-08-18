import React, { useCallback, useEffect, useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { LagredeKjørelister } from './LagredeKjørelister/LagredeKjørelister';
import { RegistrerKjøreliste } from './RegistrerKjøreliste/RegistrerKjøreliste';
import { KjørelisteOversiktDto } from './typer';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { RegistrerKjørelisteProvider } from '../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../typer/behandling/steg';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';

export const RegistrerKjørelisteFane: React.FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [kjørelisteOversikt, settKjørelisteOversikt] =
        useState<Ressurs<KjørelisteOversiktDto>>(byggTomRessurs());

    const hentKjørelisteOversikt = useCallback(() => {
        request<KjørelisteOversiktDto, null>(
            `/api/sak/kjoreliste/manuell-registrering/${behandling.id}`
        ).then(settKjørelisteOversikt);
    }, [behandling, request]);

    useEffect(() => {
        hentKjørelisteOversikt();
    }, [hentKjørelisteOversikt]);

    return (
        <DataViewer response={{ kjørelisteOversikt }} type={'reisedata'}>
            {({ kjørelisteOversikt }) => (
                <RegistrerKjørelisteProvider
                    kjørelisteOversikt={kjørelisteOversikt}
                    hentKjørelisteOversikt={hentKjørelisteOversikt}
                >
                    <VStack gap="space-24">
                        <RegistrerKjøreliste />
                        <LagredeKjørelister />
                        <StegKnapp steg={Steg.REGISTRER_KJØRELISTE}>
                            Ferdigstill registrering og gå videre
                        </StegKnapp>
                    </VStack>
                </RegistrerKjørelisteProvider>
            )}
        </DataViewer>
    );
};
