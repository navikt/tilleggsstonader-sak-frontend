import { useCallback, useMemo, useState } from 'react';

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
    autentisert: boolean;
    settIkkeAutentisert: () => void;
}

const [AppProvider, useApp] = constate(
    ({ saksbehandler, appEnv, autentisert, settIkkeAutentisert }: Props) => {
        const [toast, settToast] = useState<Toast | undefined>();

        const request = useCallback(
            <RES, REQ>(url: string, method: Method = 'GET', data?: REQ) =>
                fetchFn<RES, REQ>(url, method, () => settIkkeAutentisert(), data),
            [settIkkeAutentisert]
        ); // Saksbehandler skal inn som dep etter hvert

        const { erSaksbehandler, erBeslutter } = useMemo(() => {
            return {
                erSaksbehandler: harTilgangTilRolle(appEnv, saksbehandler, 'saksbehandler'),
                erBeslutter: harTilgangTilRolle(appEnv, saksbehandler, 'beslutter'),
            };
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
            settIkkeAutentisert,
            saksbehandler,
            erSaksbehandler,
            erBeslutter,
            appEnv,
            toast,
            settToast,

            ulagradeKomponenter,
            harUlagradeKomponenter,
            settUlagretKomponent,
            nullstillUlagretKomponent,
            nullstillUlagredeKomponenter,
        };
    }
);

export { AppProvider, useApp };
