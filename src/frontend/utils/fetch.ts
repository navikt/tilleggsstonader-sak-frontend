import { v4 as uuidv4 } from 'uuid';

import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'UPDATE';

export const fetchFn = <ResponseData, RequestData>(
    url: string,
    method: Method,
    settIkkeAutentisert: () => void,
    data?: RequestData
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
                return håndterSuksess<ResponseData>(res);
            } else {
                if (res.status === 401) {
                    settIkkeAutentisert();
                }
                return håndterFeil(res, res.headers);
            }
        })
        .catch((error) => {
            // TODO: sjekk for 401

            return {
                status: RessursStatus.FEILET,
                frontendFeilmelding: feilmeldingMedCallId(error.detail, error.headers),
                frontendFeilmeldingUtenFeilkode: error.detail,
                feilkode: feilkode(error.headers),
            };
        });
};

const håndterSuksess = <ResponseData>(res: Response): Promise<RessursSuksess<ResponseData>> => {
    const contentType = res.headers.get('Content-Type');
    if (contentType === 'application/json')
        return res.json().then((data) => ({
            data: data as ResponseData,
            status: RessursStatus.SUKSESS,
        }));

    return res.blob().then((data) => {
        return data.text().then((text) => ({
            data: text as ResponseData,
            status: RessursStatus.SUKSESS,
        }));
    });
};

const håndterFeil = (res: Response, headers: Headers): Promise<RessursFeilet> =>
    res.json().then((res) => {
        return {
            status: RessursStatus.FEILET,
            frontendFeilmelding: feilmeldingMedCallId(res.detail, headers),
            frontendFeilmeldingUtenFeilkode: res.detail,
            feilkode: feilkode(headers),
        };
    });

const feilmeldingMedCallId = (feilmelding: string, headers?: Headers): string => {
    const callId = feilkode(headers);
    return `${feilmelding}. Feilkode: ${callId}`;
};

const feilkode = (headers?: Headers): string | undefined => {
    const callId = headers?.get('Nav-Call-id');
    return callId || undefined;
};
