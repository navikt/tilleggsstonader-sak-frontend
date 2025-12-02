import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';
import { BgInfoModerateHover } from '@navikt/ds-tokens/darkside-js';

import SettPåVentForm from './SettPåVentForm';
import SettPåVentInformasjon from './SettPåVentInformasjon';
import { StatusSettPåVent } from './typer';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { SettPåVentProvider, useSettPåVent } from '../../context/SettPåVentContext';
import { useVisFeilmeldingVedUnload } from '../../hooks/useVisFeilmeldingVedUnload';
import { useKlagebehandling } from '../../Sider/Klage/context/KlagebehandlingContext';
import { KlagebehandlingStatus } from '../../Sider/Klage/typer/klagebehandling/klagebehandlingStatus';
import { BehandlingStatus } from '../../typer/behandling/behandlingStatus';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';
import DataViewer from '../DataViewer';

const Container = styled.div`
    padding: 2rem;
    background: ${BgInfoModerateHover};
`;

export const SettPåVentSak = ({
    statusPåVentRedigering,
    settStatusPåVentRedigering,
}: {
    statusPåVentRedigering: boolean;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { behandling, hentBehandling, hentBehandlingshistorikk } = useBehandling();
    return (
        <SettPåVentProvider
            context={'sak'}
            behandlingId={behandling.id}
            behandlingErSattPåVent={behandling.status === BehandlingStatus.SATT_PÅ_VENT}
            hentBehandling={hentBehandling}
            hentBehandlingshistorikk={hentBehandlingshistorikk}
        >
            <SettPåVentContainer
                statusPåVentRedigering={statusPåVentRedigering}
                settStatusPåVentRedigering={settStatusPåVentRedigering}
            />
        </SettPåVentProvider>
    );
};

export const SettPåVentKlage = () => {
    const {
        behandling,
        hentBehandling,
        hentBehandlingshistorikk,
        statusPåVentRedigering,
        settStatusPåVentRedigering,
    } = useKlagebehandling();
    return (
        <SettPåVentProvider
            context={'klage'}
            behandlingId={behandling.id}
            behandlingErSattPåVent={behandling.status === KlagebehandlingStatus.SATT_PÅ_VENT}
            hentBehandling={hentBehandling}
            hentBehandlingshistorikk={hentBehandlingshistorikk}
        >
            <SettPåVentContainer
                statusPåVentRedigering={statusPåVentRedigering}
                settStatusPåVentRedigering={settStatusPåVentRedigering}
            />
        </SettPåVentProvider>
    );
};

const SettPåVentContainer: React.FC<{
    statusPåVentRedigering: boolean;
    settStatusPåVentRedigering: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ statusPåVentRedigering, settStatusPåVentRedigering }) => {
    const { erSaksbehandler, request } = useApp();

    const { context, behandlingId, behandlingErSattPåVent } = useSettPåVent();

    const [statusResponse, settStatusResponse] =
        useState<Ressurs<StatusSettPåVent>>(byggTomRessurs());

    useEffect(() => {
        if (erSaksbehandler && behandlingErSattPåVent) {
            request<StatusSettPåVent, null>(`/api/${context}/sett-pa-vent/${behandlingId}`).then(
                settStatusResponse
            );
        }
        // skal kun hente status vid første rendering, ellers håndteres det av komponenten selv
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandlingId]);

    useVisFeilmeldingVedUnload(statusPåVentRedigering);

    if (behandlingErSattPåVent) {
        if (!erSaksbehandler) {
            return <Alert variant={'warning'}>Behandlingen er satt på vent.</Alert>;
        }
        return (
            <Container>
                <DataViewer type={'sett på vent'} response={{ statusResponse }}>
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
