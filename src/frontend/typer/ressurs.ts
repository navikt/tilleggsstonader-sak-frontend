export enum RessursStatus {
    FEILET = 'FEILET',
    HENTER = 'HENTER',
    IKKE_HENTET = 'IKKE_HENTET',
    IKKE_TILGANG = 'IKKE_TILGANG',
    SUKSESS = 'SUKSESS',
    FUNKSJONELL_FEIL = 'FUNKSJONELL_FEIL',
}

export type RessursStatusFeilet =
    | RessursStatus.FEILET
    | RessursStatus.FUNKSJONELL_FEIL
    | RessursStatus.IKKE_TILGANG;

export type RessursSuksess<T> = {
    data: T;
    status: RessursStatus.SUKSESS;
};

type RessursLaster = {
    status: RessursStatus.HENTER;
};

export type RessursFeilet = {
    frontendFeilmelding: string;
    frontendFeilmeldingUtenFeilkode: string | undefined;
    feilkode: string | undefined;
    status: RessursStatusFeilet;
    httpStatus: number | undefined;
};

export type Ressurs<T> =
    | { status: RessursStatus.IKKE_HENTET }
    | RessursLaster
    | RessursSuksess<T>
    | RessursFeilet;

export const byggTomRessurs = <T>(): Ressurs<T> => {
    return {
        status: RessursStatus.IKKE_HENTET,
    };
};

export const byggHenterRessurs = <T>(): Ressurs<T> => {
    return {
        status: RessursStatus.HENTER,
    };
};

export const byggRessursSuksess = <T>(data: T): RessursSuksess<T> => {
    return {
        status: RessursStatus.SUKSESS,
        data: data,
    };
};

export const byggRessursFeilet = (feilmelding: string): RessursFeilet => {
    return {
        status: RessursStatus.FEILET,
        frontendFeilmelding: feilmelding,
        frontendFeilmeldingUtenFeilkode: feilmelding,
        feilkode: undefined,
        httpStatus: undefined,
    };
};

export const pakkUtHvisSuksess = <T>(ressurs: Ressurs<T>) =>
    ressurs.status === RessursStatus.SUKSESS ? ressurs.data : undefined;

export const feilmeldingVedFeil = <T>(response: Ressurs<T>) =>
    erFeilressurs(response) ? response.frontendFeilmelding : undefined;

export const harNoenRessursMedStatus = (
    // eslint-disable-next-line
    ressurser: Ressurs<any>[],
    ...status: RessursStatus[]
): boolean => ressurser.some((ressurs) => status.includes(ressurs.status));

export const erFeilressurs = <T>(response: Ressurs<T>): response is RessursFeilet =>
    response.status === RessursStatus.FEILET ||
    response.status === RessursStatus.FUNKSJONELL_FEIL ||
    response.status === RessursStatus.IKKE_TILGANG;
