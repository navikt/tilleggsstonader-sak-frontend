import React, { useCallback, useState } from 'react';

import { useParams } from 'react-router-dom';

import BehandlingInnhold from './BehandlingInnhold';
import { useApp } from '../../context/AppContext';
import { useRerunnableEffect } from '../../hooks/useRerunnableEffect';
import DataViewer from '../../komponenter/DataViewer';
import { Behandling } from '../../typer/behandling/behandling';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

const BehandlingContainer = () => {
    const { request } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());

    const behandlingId = useParams<{
        behandlingId: string;
    }>().behandlingId as string;

    const hentBehandlingCallback = useCallback(() => {
        request<Behandling, null>(`/api/sak/behandling/${behandlingId}`).then(settBehandling);
    }, [request, behandlingId]);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <BehandlingInnhold behandling={behandling} hentBehandling={hentBehandling} />
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
