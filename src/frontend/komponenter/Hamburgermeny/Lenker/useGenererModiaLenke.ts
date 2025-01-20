import { useCallback } from 'react';

import { useApp } from '../../../context/AppContext';
import { RessursStatus } from '../../../typer/ressurs';
import { erProd } from '../../../utils/miljø';

interface Request {
    fnr: string;
}

/**
 * Returner en temporær kode for å kunne lenke till bruker uten å bruke ident i url
 */
interface Response {
    code: string;
}

export const useGenererModiaLenke = (ident: string) => {
    const { request } = useApp();

    const genererModiaLenke = useCallback(async (): Promise<string> => {
        const envUrl = erProd() ? '.' : '.dev.';
        const urlModiaPersonoversikt = `https://modiapersonoversikt.intern${envUrl}nav.no`;
        try {
            const response = await request<Response, Request>('/api/generer-lenke-modia', 'POST', {
                fnr: ident,
            });
            if (response.status === RessursStatus.SUKSESS) {
                return `${urlModiaPersonoversikt}/person?sokFnrCode=${response.data.code}`;
            } else {
                return `${urlModiaPersonoversikt}/person`;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return `${urlModiaPersonoversikt}/person`;
        }
    }, [request, ident]);
    return {
        genererModiaLenke,
    };
};
