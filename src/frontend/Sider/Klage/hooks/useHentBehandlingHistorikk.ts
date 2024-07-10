import { useCallback, useState } from 'react';
import { Behandlingshistorikk } from '../typer/behandlingshistorikk';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';

export const useHentBehandlingHistorikk = (behandlingId: string) => {
    const { request } = useApp();

    const [behandlingHistorikk, settBehandlingHistorikk] =
        useState<Ressurs<Behandlingshistorikk[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        request<Behandlingshistorikk[], null>(
            `/api/klage/behandlingshistorikk/${behandlingId}`,
        ).then(settBehandlingHistorikk);
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
