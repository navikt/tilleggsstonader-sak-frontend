import React, { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import BehandlingInnhold from './BehandlingInnhold';
import { useApp } from '../../context/AppContext';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import { VilkårProvider } from '../../context/VilkårContext';
import { useRerunnableEffect } from '../../hooks/useRerunnableEffect';
import DataViewer from '../../komponenter/DataViewer';
import { Behandling } from '../../typer/behandling/behandling';
import { Personopplysninger } from '../../typer/personopplysninger';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';

const BehandlingContainer = () => {
    const { request } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());
    const [personopplysninger, settPersonopplysninger] =
        useState<Ressurs<Personopplysninger>>(byggTomRessurs());

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

    return (
        <DataViewer response={{ behandling, personopplysninger }}>
            {({ behandling, personopplysninger }) => (
                <BehandlingProvider behandling={behandling} hentBehandling={hentBehandling}>
                    <PersonopplysningerProvider personopplysninger={personopplysninger}>
                        <VilkårProvider behandling={behandling}>
                            <BehandlingInnhold />
                        </VilkårProvider>
                    </PersonopplysningerProvider>
                </BehandlingProvider>
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
