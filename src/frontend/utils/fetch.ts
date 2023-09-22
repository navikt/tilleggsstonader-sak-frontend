import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';

export const håndterSuksess = <ResponseData>(
    res: Response
): Promise<RessursSuksess<ResponseData>> =>
    res.json().then((data) => ({
        data: data as ResponseData,
        status: RessursStatus.SUKSESS,
    }));
export const håndterFeil = (res: Response, headers: Headers): Promise<RessursFeilet> =>
    res.json().then((res) => {
        return {
            status: RessursStatus.FEILET,
            frontendFeilmelding: feilmeldingMedCallId(res.detail, headers),
            melding: res.detail,
        };
    });
export const feilmeldingMedCallId = (feilmelding: string, headers?: Headers): string => {
    const callId = headers?.get('Nav-Call-id');
    return `${feilmelding}. Feilkode: ${callId}`;
};
