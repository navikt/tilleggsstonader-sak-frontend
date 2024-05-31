import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { IBehandlingshistorikk } from '../../Komponenter/Behandling/Høyremeny/behandlingshistorikk';
import { behandlingshistorikkStub, behandlingStub } from '../api/klage-stubs';

export const useHentBehandlingHistorikk = (
    behandlingId: string
): {
    hentBehandlingshistorikkCallback: () => void;
    behandlingHistorikk: Ressurs<IBehandlingshistorikk[]>;
} => {
    const { axiosRequest } = useApp();

    const [behandlingHistorikk, settBehandlingHistorikk] =
        useState<Ressurs<IBehandlingshistorikk[]>>(byggTomRessurs());

    const hentBehandlingshistorikkCallback = useCallback(() => {
        // const behandlingConfig: AxiosRequestConfig = {
        //     method: 'GET',
        //     url: `/familie-klage/api/behandlingshistorikk/${behandlingId}`,
        // };
        // axiosRequest<IBehandlingshistorikk[], null>(behandlingConfig).then(
        //     (res: Ressurs<IBehandlingshistorikk[]>) => settBehandlingHistorikk(res)
        // );
        // // eslint-disable-next-line
        settBehandlingHistorikk({ status: RessursStatus.SUKSESS, data: behandlingshistorikkStub });
    }, [behandlingId]);

    return {
        behandlingHistorikk,
        hentBehandlingshistorikkCallback,
    };
};
