export interface Personopplysninger {
    personIdent: string;
    navn: Navn;
    harVergemål: boolean;
    fullmakt: Fullmakt[];
    vergemål: Vergemål[];
}

interface Navn {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    visningsnavn: string;
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
