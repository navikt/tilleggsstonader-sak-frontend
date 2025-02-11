export enum RessursStatus {
    FEILET = 'FEILET',
    HENTER = 'HENTER',
    IKKE_HENTET = 'IKKE_HENTET',
    IKKE_TILGANG = 'IKKE_TILGANG',
    SUKSESS = 'SUKSESS',
    FUNKSJONELL_FEIL = 'FUNKSJONELL_FEIL',
}

export type RessursSuksess<T> = {
    data: T;
    status: RessursStatus.SUKSESS;
};

type RessursLaster = {
    status: RessursStatus.HENTER;
};

type FeilMelding = {
    melding: string;
    feilkode: string | undefined;
};

export type RessursFeilet =
    | (FeilMelding & { status: RessursStatus.IKKE_TILGANG })
    | (FeilMelding & { status: RessursStatus.FEILET })
    | (FeilMelding & { status: RessursStatus.FUNKSJONELL_FEIL });

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
        melding: feilmelding,
        feilkode: undefined,
    };
};

export const pakkUtHvisSuksess = <T>(ressurs: Ressurs<T>) =>
    ressurs.status === RessursStatus.SUKSESS ? ressurs.data : undefined;

export const feilmeldingVedFeil = <T>(response: Ressurs<T>) =>
    erFeilressurs(response) ? response.melding : undefined;

export const harNoenRessursMedStatus = (
    // eslint-disable-next-line
    ressurser: Ressurs<any>[],
    ...status: RessursStatus[]
): boolean => ressurser.some((ressurs) => status.includes(ressurs.status));

export const erFeilressurs = <T>(response: Ressurs<T>): response is RessursFeilet =>
    response.status === RessursStatus.FEILET ||
    response.status === RessursStatus.FUNKSJONELL_FEIL ||
    response.status === RessursStatus.IKKE_TILGANG;
