import { useCallback, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { Behandlingshistorikk } from '../typer/behandlingshistorikk';
import { Klagebehandling } from '../typer/klagebehandling/klagebehandling';

export const useHentBehandlingHistorikk = (behandling: Klagebehandling) => {
    const { request } = useApp();

    const [behandlingHistorikk, settBehandlingHistorikk] =
        useState<Ressurs<Behandlingshistorikk[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        request<Behandlingshistorikk[], null>(
            `/api/klage/behandlingshistorikk/${behandling.id}`
        ).then(settBehandlingHistorikk);
    }, [behandling.id, request]);

    const hentBehandlingshistorikk = useRerunnableEffect(hentBehandlingshistorikkCallback, [
        request,
        behandling.id,
        behandling.status,
        behandling.steg,
    ]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikk,
    };
};
