export interface Personopplysninger {
    personIdent: string;
    navn: Navn;
    harVergemål: boolean;
    harFullmektig: boolean;
    adressebeskyttelse: Adressebeskyttelse;
    fullmakt: Fullmakt[];
    vergemål: Vergemål[];
}

interface Navn {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    visningsnavn: string;
}

export enum Adressebeskyttelse {
    STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
    STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
    FORTROLIG = 'FORTROLIG',
    UGRADERT = 'UGRADERT',
}

export interface Vergemål {
    embete?: string;
    type?: string;
    motpartsPersonident?: string;
    navn?: string;
    omfang?: string;
}

export interface Fullmakt {
    gyldigFraOgMed: string;
    gyldigTilOgMed: string;
    motpartsPersonident: string;
    navn?: string;
    områder: string[];
}
