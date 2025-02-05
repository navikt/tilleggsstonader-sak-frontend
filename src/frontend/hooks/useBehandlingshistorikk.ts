import { useCallback, useState } from 'react';

import { RerrunnableEffect, useRerunnableEffect } from './useRerunnableEffect';
import { useApp } from '../context/AppContext';
import { HistorikkHendelse } from '../Sider/Behandling/Venstremeny/Historikk/typer';
import { Behandling } from '../typer/behandling/behandling';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface BehandlingshistorikkResponse {
    hentBehandlingshistorikk: RerrunnableEffect;
    behandlingshistorikk: Ressurs<HistorikkHendelse[]>;
}

export const useBehandlingshistorikk = (behandling: Behandling): BehandlingshistorikkResponse => {
    const { request } = useApp();

    const [behandlingshistorikk, settBehandlingshistorikk] =
        useState<Ressurs<HistorikkHendelse[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        request<HistorikkHendelse[], null>(`/api/sak/behandlingshistorikk/${behandling.id}`).then(
            settBehandlingshistorikk
        );
    }, [request, behandling.id]);

    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        request,
        behandling.id,
        behandling.status,
    ]);

    return {
        hentBehandlingshistorikk,
        behandlingshistorikk,
    };
};
