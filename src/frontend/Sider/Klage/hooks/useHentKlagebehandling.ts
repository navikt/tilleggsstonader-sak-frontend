import { useKlageApp } from '../context/KlageAppContext';
import { useCallback, useState } from 'react';
import { Klagebehandling } from '../App/typer/klagebehandling/klagebehandling';
import { AxiosRequestConfig } from 'axios';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

export const useHentKlagebehandling = (
    behandlingId: string
): {
    hentBehandlingCallback: () => void;
    behandling: Ressurs<Klagebehandling>;
} => {
    const { axiosRequest } = useKlageApp();
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
