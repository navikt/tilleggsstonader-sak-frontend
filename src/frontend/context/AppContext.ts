import { useCallback } from 'react';

import constate from 'constate';

import { fetchFn } from '../utils/fetch';

const [AppProvider, useApp] = constate(() => {
    const request = useCallback(fetchFn, []); // Saksbehandler skal inn som dep etter hvert

    return {
        request,
    };
});

export { AppProvider, useApp };
