import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { Klagebehandling } from '../typer/klagebehandling';
import { AxiosRequestConfig } from 'axios';

export const useHentBehandling = (
    behandlingId: string
): {
    hentBehandlingCallback: () => void;
    behandling: Ressurs<Klagebehandling>;
} => {
    const { axiosRequest } = useApp();
    const [behandling, settBehandling] = useState<Ressurs<Klagebehandling>>(byggTomRessurs());

    const hentBehandlingCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `api/klage/behandling/${behandlingId}`,
        };
        axiosRequest<Klagebehandling, null>(behandlingConfig).then((res: Ressurs<Klagebehandling>) =>
            settBehandling(res)
        );
    }, [axiosRequest, behandlingId]);

    return {
        hentBehandlingCallback,
        behandling,
    };
};
