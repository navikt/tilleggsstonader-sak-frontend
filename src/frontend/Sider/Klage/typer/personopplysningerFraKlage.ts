export interface PersonopplysningerFraKlage {
    personIdent: string;
    fagsakPersonId: string;
    navn: string;
    adressebeskyttelse?: Adressebeskyttelse;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
    dødsdato?: string;
    fødselsdato?: string;
    egenAnsatt: boolean;
    navEnhet: string;
    vergemål: Vergemål[];
    harFullmektig: boolean;
}

export enum kjønnType {
    KVINNE = 'KVINNE',
    MANN = 'MANN',
    UKJENT = 'UKJENT',
}

export interface Vergemål {
    embete?: string;
    type?: string;
    motpartsPersonident?: string;
    navn?: string;
    omfang?: string;
}

export enum Adressebeskyttelse {
    STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
    STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
    FORTROLIG = 'FORTROLIG',
    UGRADERT = 'UGRADERT',
}

export enum Folkeregisterpersonstatus {
    BOSATT = 'BOSATT',
    UTFLYTTET = 'UTFLYTTET',
    FORSVUNNET = 'FORSVUNNET',
    DØD = 'DØD',
    OPPHØRT = 'OPPHØRT',
    FØDSELSREGISTRERT = 'FØDSELSREGISTRERT',
    MIDLERTIDIG = 'MIDLERTIDIG',
    INAKTIV = 'INAKTIV',
    UKJENT = 'UKJENT',
}
