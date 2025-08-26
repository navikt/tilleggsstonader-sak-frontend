import React, { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import BehandlingInnhold from './BehandlingInnhold';
import { useApp } from '../../context/AppContext';
import { useRerunnableEffect } from '../../hooks/useRerunnableEffect';
import DataViewer from '../../komponenter/DataViewer';
import { Behandling, SluttdatoForForrigeVedtak } from '../../typer/behandling/behandling';
import { BehandlingFakta } from '../../typer/behandling/behandlingFakta/behandlingFakta';
import { Personopplysninger } from '../../typer/personopplysninger';
import { byggRessursSuksess, byggTomRessurs, Ressurs } from '../../typer/ressurs';

const BehandlingContainer = () => {
    const { request } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());
    const [personopplysninger, settPersonopplysninger] =
        useState<Ressurs<Personopplysninger>>(byggTomRessurs());
    const [behandlingFakta, settBehandlingFakta] =
        useState<Ressurs<BehandlingFakta>>(byggTomRessurs());
    const [sluttDatoForrigeVedtak, settSluttDatoForrigeVedtak] =
        useState<Ressurs<SluttdatoForForrigeVedtak>>(byggTomRessurs());

    const behandlingId = useParams<{
        behandlingId: string;
    }>().behandlingId as string;

    const hentBehandlingFaktaCallback = useCallback(() => {
        request<BehandlingFakta, null>(`/api/sak/behandling/${behandlingId}/fakta`).then(
            settBehandlingFakta
        );
    }, [request, behandlingId]);

    const hentBehandlingCallback = useCallback(() => {
        request<Behandling, null>(`/api/sak/behandling/${behandlingId}`).then((behandling) => {
            settBehandling(behandling);

            if (behandling.status === 'SUKSESS' && behandlingFakta.status === 'IKKE_HENTET') {
                hentBehandlingFaktaCallback();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request, behandlingId, hentBehandlingFaktaCallback]);

    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);

    useEffect(() => {
        request<Personopplysninger, null>(`/api/sak/personopplysninger/${behandlingId}`).then(
            settPersonopplysninger
        );
    }, [request, behandlingId]);

    useEffect(() => {
        if (behandling.status === 'SUKSESS') {
            if (behandling.data.forrigeIverksatteBehandlingId) {
                request<SluttdatoForForrigeVedtak, null>(
                    `/api/sak/vedtak/${behandling.data.forrigeIverksatteBehandlingId}/sluttdato`
                ).then(settSluttDatoForrigeVedtak);
            } else {
                settSluttDatoForrigeVedtak(
                    byggRessursSuksess({
                        sluttdato: undefined,
                    })
                );
            }
        }
    }, [behandling, behandlingId, request]);

    useEffect(() => {
        document.title = 'Behandling';
    }, []);

    return (
        <DataViewer
            type={'behandlingsinformasjon'}
            response={{ behandling, personopplysninger, behandlingFakta, sluttDatoForrigeVedtak }}
        >
            {({ behandling, personopplysninger, behandlingFakta, sluttDatoForrigeVedtak }) => (
                <BehandlingInnhold
                    behandling={behandling}
                    hentBehandling={hentBehandling}
                    personopplysninger={personopplysninger}
                    behandlingFakta={behandlingFakta}
                    sluttDatoForrigeVedtak={sluttDatoForrigeVedtak}
                />
            )}
        </DataViewer>
    );
};

export default BehandlingContainer;
