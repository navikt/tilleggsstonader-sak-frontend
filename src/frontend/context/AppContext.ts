import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useUlagredeKomponenter } from '../hooks/useUlagredeKomponenter';
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

    useEffect(() => {
        settErSaksbehandler(harTilgangTilRolle(appEnv, saksbehandler, 'saksbehandler'));
    }, [saksbehandler, appEnv]);

    const {
        ulagradeKomponenter,
        harUlagradeKomponenter,
        settUlagretKomponent,
        nullstillUlagretKomponent,
        nullstillUlagredeKomponenter,
    } = useUlagredeKomponenter();

    return {
        request,
        autentisert,
        saksbehandler,
        erSaksbehandler,
        appEnv,
        toast,
        settToast,

        ulagradeKomponenter,
        harUlagradeKomponenter,
        settUlagretKomponent,
        nullstillUlagretKomponent,
        nullstillUlagredeKomponenter,
    };
});

export { AppProvider, useApp };
