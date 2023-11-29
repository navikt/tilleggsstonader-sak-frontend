export interface Brevmottaker {
    personIdent: string;
    mottakerRolle: BrevmottakerRolle;
}

export interface Brevmottakere {
    personer: Brevmottaker[];
    organisasjoner: OrganisasjonMottaker[];
}

export interface OrganisasjonMottaker {
    organisasjonsnummer: string;
    navnHosOrganisasjon: string;
    mottakerRolle: BrevmottakerRolle.VERGE | BrevmottakerRolle.FULLMAKT;
}

export enum BrevmottakerRolle {
    BRUKER = 'BRUKER',
    VERGE = 'VERGE',
    FULLMAKT = 'FULLMAKT',
}
