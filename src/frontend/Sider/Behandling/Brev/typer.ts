export interface Brevmal {
    _id: string;
    visningsnavn: string;
    publisert: boolean;
}

export interface MalStruktur extends Brevmal {
    brevtittel: string;
    delmaler: Delmal[];
}

export interface Variabel {
    _id: string;
    _type: 'variabel';
    erHtml: boolean;
    visningsnavn: string;
}

export interface Tekst {
    _type: 'tekst';
    _id: string;
    innhold: Blockcontent[];
    variabler: Variabel[];
    visningsnavn: string;
}

export interface Fritekst {
    _type: 'fritekst';
}

export type Valg = Fritekst | Tekst;

export interface Valgfelt {
    _type: 'valgfelt';
    _id: string;
    valg: Valg[];
    visningsnavn: string;
}

interface Blockcontent {
    _type: 'block';
    _key: string;
    markDefs: Variabel[];
}

export interface Delmal {
    _id: string;
    _type: string;
    visningsnavn: string;
    blocks: (Valgfelt | Fritekst | Blockcontent)[];
}
export interface FritekstAvsnitt {
    deloverskrift: string;
    innhold: string;
}
