import { useCallback, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { Behandlingshistorikk } from '../typer/behandlingshistorikk';

export const useHentBehandlingHistorikk = (behandlingId: string) => {
    const { request } = useApp();

    const [behandlingHistorikk, settBehandlingHistorikk] =
        useState<Ressurs<Behandlingshistorikk[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        request<Behandlingshistorikk[], null>(
            `/api/klage/behandlingshistorikk/${behandlingId}`
        ).then(settBehandlingHistorikk);
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
