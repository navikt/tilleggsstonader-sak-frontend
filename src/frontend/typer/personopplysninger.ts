export interface Personopplysninger {
    personIdent: string;
    navn: Navn;
    alder?: number;
    harVergemål: boolean;
    harFullmektig: boolean;
    adressebeskyttelse: Adressebeskyttelse;
    erSkjermet: boolean;
    vergemål: Vergemål[];
    dødsdato?: string;
    harGeografiskTilknytningUtland: boolean;
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
