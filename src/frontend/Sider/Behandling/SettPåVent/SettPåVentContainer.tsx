import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';
import { AGray100 } from '@navikt/ds-tokens/dist/tokens';

import SettPåVentForm from './SettPåVentForm';
import SettPåVentInformasjon from './SettPåVentInformasjon';
import { StatusSettPåVent } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVisFeilmeldingVedUnload } from '../../../hooks/useVisFeilmeldingVedUnload';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

const Container = styled.div`
    margin: 2rem;
    padding: 2rem;
    background: ${AGray100};
`;

const SettPåVentContainer: React.FC<{
    statusPåVentRedigering: boolean;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ statusPåVentRedigering, settStatusPåVentRedigering }) => {
    const { request, erSaksbehandler } = useApp();
    const { behandling } = useBehandling();

    const [statusResponse, settStatusResponse] =
        useState<Ressurs<StatusSettPåVent>>(byggTomRessurs());

    useEffect(() => {
        if (erSaksbehandler && behandling.status === BehandlingStatus.SATT_PÅ_VENT) {
            request<StatusSettPåVent, null>(`/api/sak/sett-pa-vent/${behandling.id}`).then(
                settStatusResponse
            );
        }
        // skal kun hente status vid første rendering, ellers håndteres det av komponenten selv
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandling.id]);

    useVisFeilmeldingVedUnload(statusPåVentRedigering);

    if (behandling.status === BehandlingStatus.SATT_PÅ_VENT) {
        if (!erSaksbehandler) {
            return <Alert variant={'warning'}>Behandlingen er satt på vent.</Alert>;
        }
        return (
            <Container>
                <DataViewer response={{ statusResponse }}>
                    {({ statusResponse }) => (
                        <>
                            <SettPåVentInformasjon
                                status={statusResponse}
                                statusPåVentRedigering={statusPåVentRedigering}
                                settStatusPåVentRedigering={settStatusPåVentRedigering}
                            />
                            {statusPåVentRedigering && (
                                <SettPåVentForm
                                    status={statusResponse}
                                    settStatusPåVent={settStatusResponse}
                                    settStatusPåVentRedigering={settStatusPåVentRedigering}
                                />
                            )}
                        </>
                    )}
                </DataViewer>
            </Container>
        );
    } else if (statusPåVentRedigering) {
        return (
            <Container>
                <SettPåVentForm
                    status={undefined}
                    settStatusPåVent={settStatusResponse}
                    settStatusPåVentRedigering={settStatusPåVentRedigering}
                />
            </Container>
        );
    } else {
        return null;
    }
};
export default SettPåVentContainer;
