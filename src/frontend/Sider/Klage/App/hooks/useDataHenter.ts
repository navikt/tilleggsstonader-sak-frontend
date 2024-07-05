import { useState, useEffect, useCallback } from 'react';
import { AxiosRequestConfig } from 'axios';
import { useKlageApp } from '../context/KlageAppContext';
import { Ressurs, RessursStatus } from '../../../../typer/ressurs';

type Props<D> = AxiosRequestConfig & { data?: D };

export const useDataHenter = <T, D>(config: Props<D>): Ressurs<T> => {
    const { axiosRequest } = useKlageApp();
    const [response, setResponse] = useState<Ressurs<T>>({
        status: RessursStatus.IKKE_HENTET,
    });

    const hentData = useCallback(() => {
        setResponse({ status: RessursStatus.HENTER });
        axiosRequest<T, D>(config).then((res: Ressurs<T>) => setResponse(res));
        // eslint-disable-next-line
    }, [config]);

    useEffect(() => {
        hentData();
    }, [hentData]);

    return response;
};
