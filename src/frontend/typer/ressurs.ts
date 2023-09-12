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
    errorMelding?: string;
    melding: string;
    frontendFeilmelding: string;
    frontendFeilmeldingUtenFeilkode?: string;
};

type RessursFeilet =
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

export const harNoenRessursMedStatus = (
    // eslint-disable-next-line
    ressurser: Ressurs<any>[],
    ...status: RessursStatus[]
): boolean => ressurser.some((ressurs) => status.includes(ressurs.status));
