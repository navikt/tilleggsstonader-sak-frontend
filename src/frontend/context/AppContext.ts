import { useCallback, useState } from 'react';

import constate from 'constate';

import { AppEnv } from '../utils/env';
import { fetchFn, Method } from '../utils/fetch';
import { Saksbehandler } from '../utils/saksbehandler';

interface Props {
    saksbehandler: Saksbehandler;
}

const [AppProvider, useApp] = constate(({ saksbehandler }: Props) => {
    const [autentisert, settAutentisert] = useState(true);
    const request = useCallback(
        <RES, REQ>(url: string, method: Method = 'GET', data?: REQ) =>
            fetchFn<RES, REQ>(url, method, () => settAutentisert(false), data),
        []
    ); // Saksbehandler skal inn som dep etter hvert

    const appEnv: AppEnv = {
        roller: {
            veileder: '',
            saksbehandler: '',
            beslutter: '',
            kode6: '',
            kode7: '',
            egenAnsatt: '',
        },
    };

    return {
        request,
        autentisert,
        saksbehandler,
        appEnv,
    };
});

export { AppProvider, useApp };
