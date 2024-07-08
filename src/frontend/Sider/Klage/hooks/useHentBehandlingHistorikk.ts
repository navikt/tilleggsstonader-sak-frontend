import { useKlageApp } from '../context/KlageAppContext';
import { useCallback, useState } from 'react';
import { Behandlingshistorikk } from '../typer/behandlingshistorikk';
import { AxiosRequestConfig } from 'axios';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

export const useHentBehandlingHistorikk = (
    behandlingId: string
): {
    hentBehandlingshistorikkCallback: () => void;
    behandlingHistorikk: Ressurs<Behandlingshistorikk[]>;
} => {
    const { axiosRequest } = useKlageApp();

    const [behandlingHistorikk, settBehandlingHistorikk] =
        useState<Ressurs<Behandlingshistorikk[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/api/klage/behandlingshistorikk/${behandlingId}`,
        };
        axiosRequest<Behandlingshistorikk[], null>(behandlingConfig).then(
            (res: Ressurs<Behandlingshistorikk[]>) => settBehandlingHistorikk(res)
        );
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
