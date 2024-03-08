import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { AGray100 } from '@navikt/ds-tokens/dist/tokens';

import SettPåVentForm from './SettPåVentForm';
import SettPåVentInformasjon from './SettPåVentInformasjon';
import { StatusSettPåVent } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

const Container = styled.div`
    margin: 2rem;
    padding: 2rem;
    background: ${AGray100};
`;

const SettPåVentContainer = () => {
    const { request } = useApp();
    const { behandling, statusPåVentRedigering } = useBehandling();

    const [statusResponse, settStatusResponse] =
        useState<Ressurs<StatusSettPåVent>>(byggTomRessurs());

    useEffect(() => {
        if (behandling.status === BehandlingStatus.SATT_PÅ_VENT) {
            request<StatusSettPåVent, null>(`/api/sak/sett-pa-vent/${behandling.id}`).then(
                settStatusResponse
            );
        }
        // skal kun hente status vid første rendering, ellers håndteres det av komponenten selv
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandling.id]);

    if (behandling.status === BehandlingStatus.SATT_PÅ_VENT) {
        return (
            <Container>
                <DataViewer response={{ statusResponse }}>
                    {({ statusResponse }) => (
                        <>
                            <SettPåVentInformasjon status={statusResponse} />
                            {statusPåVentRedigering && (
                                <SettPåVentForm
                                    status={statusResponse}
                                    settStatusPåVent={settStatusResponse}
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
                <SettPåVentForm status={undefined} settStatusPåVent={settStatusResponse} />
            </Container>
        );
    } else {
        return null;
    }
};
export default SettPåVentContainer;
