import { JaNei } from '../../common';

export interface FaktaFlyttingDetaljer {
    årsak: Flytteårsak;
    flyttedato: string;
    adresse: FaktaFlytteadresse;
    skalFlytteFraFolkeregistrertAdresse?: JaNei;
    adresseDetSkalFlyttesFra?: FaktaFlytteadresse;
    flyttemåte: Flyttemåte;
    utgifterDekketPåAnnenMåte: JaNei;
    utgifterEgenFlytting?: FaktaUtgifterEgenFlytting;
    flyttetilbud?: FaktaFlyttetilbud[];
}

export interface FaktaFlytteadresse {
    gateadresse?: string;
    postnummer?: string;
    poststed?: string;
    landkode?: string;
}

export interface FaktaUtgifterEgenFlytting {
    avstand: number;
    hengerleie?: number;
    bom?: number;
    parkering?: number;
    ferje?: number;
    annet?: number;
}

export interface FaktaFlyttetilbud {
    navn: string;
    beløp: number;
}

export type Flytteårsak = 'NY_JOBB' | 'AKTIVITET';

export const flytteårsakTilTekst: Record<Flytteårsak, string> = {
    NY_JOBB: 'Ny jobb',
    AKTIVITET: 'Aktivitet',
};

export type Flyttemåte = 'FLYTTER_SELV' | 'FLYTTEBYRÅ';

export const flyttemåteTilTekst: Record<Flyttemåte, string> = {
    FLYTTER_SELV: 'Flytter selv',
    FLYTTEBYRÅ: 'Flyttebyrå',
};
