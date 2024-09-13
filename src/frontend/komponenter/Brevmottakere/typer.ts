export interface IBrevmottaker {
    id: string;
    personIdent: string;
    navn: string;
    mottakerRolle: EBrevmottakerRolle;
}

export interface IBrevmottakere {
    personer: IBrevmottaker[];
    organisasjoner: IOrganisasjonMottaker[];
}

export interface IOrganisasjonMottaker {
    id: string;
    organisasjonsnummer: string;
    organisasjonsnavn: string;
    navnHosOrganisasjon: string;
}

export enum EBrevmottakerRolle {
    BRUKER = 'BRUKER',
    VERGE = 'VERGE',
    FULLMAKT = 'FULLMAKT',
}

export enum Applikasjonskontekst {
    SAK = 'SAK',
    KLAGE = 'KLAGE',
}
