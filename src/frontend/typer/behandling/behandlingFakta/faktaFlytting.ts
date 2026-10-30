import { FaktaAdresse } from './faktaAdresse';
import { JaNei } from '../../common';

export interface FaktaFlyttingDetaljer {
    årsak: Flytteårsak;
    flyttedato: string;
    adresse: FaktaAdresse;
    skalFlytteFraFolkeregistrertAdresse: JaNei;
    adresseDetSkalFlyttesFra: FaktaAdresse;
    flyttemåte: Flyttemåte;
    utgifterDekketPåAnnenMåte: JaNei;
    utgifterEgenFlytting?: FaktaUtgifterEgenFlytting;
    flyttetilbud?: FaktaFlyttetilbud[];
}

export interface FaktaUtgifterEgenFlytting {
    avstand: number;
    hengerleie?: number;
    leiebil?: number;
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
