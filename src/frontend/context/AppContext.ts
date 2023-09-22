import { useCallback } from 'react';

import constate from 'constate';
import { v4 as uuidv4 } from 'uuid';

import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { feilmeldingMedCallId, håndterFeil, håndterSuksess } from '../utils/fetch';

const [AppProvider, useApp] = constate(() => {
    const request = useCallback(
        <ResponseData, RequestData>(
            url: string,
            method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'UPDATE' = 'GET',
            data: RequestData
        ): Promise<RessursSuksess<ResponseData> | RessursFeilet> => {
            const requestId = uuidv4().replaceAll('-', '');

            return fetch(url, {
                body: JSON.stringify(data),
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-request-id': requestId,
                },
            })
                .then((res): Promise<RessursSuksess<ResponseData> | RessursFeilet> => {
                    if (res.ok) {
                        return håndterSuksess<ResponseData>(res).then((suksess) => suksess);
                    } else {
                        return håndterFeil(res, res.headers).then((feil) => feil);
                    }
                })
                .catch((error) => {
                    // TODO: sjekk for 401

                    return {
                        status: RessursStatus.FEILET,
                        frontendFeilmelding: feilmeldingMedCallId(error.detail, error.headers),
                        melding: error.detail,
                    };
                });
        },
        []
    );

    return {
        request,
    };
});

export { AppProvider, useApp };
