import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useUlagretData } from '../hooks/useUlagretData';
import { Toast } from '../typer/toast';
import { AppEnv } from '../utils/env';
import { fetchFn, Method } from '../utils/fetch';
import { harTilgangTilRolle } from '../utils/roller';
import { Saksbehandler } from '../utils/saksbehandler';

interface Props {
    saksbehandler: Saksbehandler;
    appEnv: AppEnv;
}

const [AppProvider, useApp] = constate(({ saksbehandler, appEnv }: Props) => {
    const [autentisert, settAutentisert] = useState(true);

    const [erSaksbehandler, settErSaksbehandler] = useState(
        harTilgangTilRolle(appEnv, saksbehandler, 'saksbehandler')
    );

    const [toast, settToast] = useState<Toast | undefined>();

    const request = useCallback(
        <RES, REQ>(url: string, method: Method = 'GET', data?: REQ) =>
            fetchFn<RES, REQ>(url, method, () => settAutentisert(false), data),
        []
    ); // Saksbehandler skal inn som dep etter hvert

    const loggUt = useCallback(() => {
        fetch('/oauth2/logout').then(() => {
            settAutentisert(false);
        });
    }, []);

    useEffect(() => {
        settErSaksbehandler(harTilgangTilRolle(appEnv, saksbehandler, 'saksbehandler'));
    }, [saksbehandler, appEnv]);

    const {
        harUlagretData,
        nullstillIkkePersistertKomponent,
        nullstillIkkePersisterteKomponenter,
        settIkkePersistertKomponent,
    } = useUlagretData();

    return {
        request,
        autentisert,
        loggUt,
        saksbehandler,
        erSaksbehandler,
        appEnv,
        toast,
        settToast,

        harUlagretData,
        nullstillIkkePersistertKomponent,
        nullstillIkkePersisterteKomponenter,
        settIkkePersistertKomponent,
    };
});

export { AppProvider, useApp };
