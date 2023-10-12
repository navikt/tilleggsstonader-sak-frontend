import { useCallback, useState } from 'react';

import constate from 'constate';

import { fetchFn, Method } from '../utils/fetch';

const [AppProvider, useApp] = constate(() => {
    const [autentisert, settAutentisert] = useState(true);
    const request = useCallback(
        <RES, REQ>(url: string, method: Method = 'GET', data?: REQ) =>
            fetchFn<RES, REQ>(url, method, () => settAutentisert(false), data),
        []
    ); // Saksbehandler skal inn som dep etter hvert

    return {
        request,
        autentisert,
    };
});

export { AppProvider, useApp };
