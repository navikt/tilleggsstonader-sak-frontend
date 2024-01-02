export interface Personopplysninger {
    personIdent: string;
    navn: Navn;
}

interface Navn {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    visningsnavn: string;
}
