import React, { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import BehandlingInnhold from './BehandlingInnhold';
import { useApp } from '../../context/AppContext';
import { useRerunnableEffect } from '../../hooks/useRerunnableEffect';
import DataViewer from '../../komponenter/DataViewer';
import { Behandling } from '../../typer/behandling/behandling';
import { BehandlingFakta } from '../../typer/behandling/behandlingFakta/behandlingFakta';
import { Personopplysninger } from '../../typer/personopplysninger';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

const BehandlingContainer = () => {
    const { request } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());
    const [personopplysninger, settPersonopplysninger] =
        useState<Ressurs<Personopplysninger>>(byggTomRessurs());
    const [behandlingFakta, settBehandlingFakta] =
        useState<Ressurs<BehandlingFakta>>(byggTomRessurs());

    const behandlingId = useParams<{
        behandlingId: string;
    }>().behandlingId as string;

    const hentBehandlingCallback = useCallback(() => {
        request<Behandling, null>(`/api/sak/behandling/${behandlingId}`).then(settBehandling);
    }, [request, behandlingId]);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);

    useEffect(() => {
        request<Personopplysninger, null>(`/api/sak/personopplysninger/${behandlingId}`).then(
            settPersonopplysninger
        );
    }, [request, behandlingId]);

    useEffect(() => {
        document.title = 'Behandling';
    }, []);

    const hentBehandlingFaktaCallback = useCallback(() => {
        request<BehandlingFakta, null>(`/api/sak/behandling/${behandlingId}/fakta`).then(
            settBehandlingFakta
        );
    }, [request, behandlingId]);

    useEffect(hentBehandlingFaktaCallback, [hentBehandlingFaktaCallback]);

    return (
        <DataViewer response={{ behandling, personopplysninger, behandlingFakta }}>
            {({ behandling, personopplysninger, behandlingFakta }) => (
                <BehandlingInnhold
                    behandling={behandling}
                    hentBehandling={hentBehandling}
                    personopplysninger={personopplysninger}
                    behandlingFakta={behandlingFakta}
                />
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
