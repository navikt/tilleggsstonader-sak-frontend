import { useKlageApp } from '../context/KlageAppContext';
import { useCallback, useState } from 'react';
import { IBehandlingshistorikk } from '../../Komponenter/Behandling/Høyremeny/behandlingshistorikk';
import { AxiosRequestConfig } from 'axios';
import { byggTomRessurs, Ressurs } from '../../../../typer/ressurs';

export const useHentBehandlingHistorikk = (
    behandlingId: string
): {
    hentBehandlingshistorikkCallback: () => void;
    behandlingHistorikk: Ressurs<IBehandlingshistorikk[]>;
} => {
    const { axiosRequest } = useKlageApp();

    const [behandlingHistorikk, settBehandlingHistorikk] =
        useState<Ressurs<IBehandlingshistorikk[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/api/klage/behandlingshistorikk/${behandlingId}`,
        };
        axiosRequest<IBehandlingshistorikk[], null>(behandlingConfig).then(
            (res: Ressurs<IBehandlingshistorikk[]>) => settBehandlingHistorikk(res)
        );
        // eslint-disable-next-line
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
