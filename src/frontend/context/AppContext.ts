import { useCallback, useState } from 'react';

import constate from 'constate';

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

    return {
        request,
        autentisert,
        saksbehandler,
    };
});

export { AppProvider, useApp };
