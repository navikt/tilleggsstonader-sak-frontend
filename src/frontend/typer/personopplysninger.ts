export interface Personopplysninger {
    personIdent: string;
    navn: Navn;
    harVergemål: boolean;
}

interface Navn {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    visningsnavn: string;
}
