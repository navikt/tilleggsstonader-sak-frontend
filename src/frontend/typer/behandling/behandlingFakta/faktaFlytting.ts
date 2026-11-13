import { FaktaAdresse } from './faktaAdresse';
import { Drivstofftype } from './faktaReise';
import { JaNei } from '../../common';

export interface FaktaFlyttingDetaljer {
    årsak: Flytteårsak;
    flyttedato: string;
    adresse: FaktaAdresse;
    skalFlytteFraFolkeregistrertAdresse: JaNei;
    adresseDetSkalFlyttesFra: FaktaAdresse;
    flyttemåte: Flyttemåte;
    utgifterDekketPåAnnenMåte: UtgifterDekketPåAnnenMåte;
    utgifterEgenFlytting?: FaktaUtgifterEgenFlytting;
    flyttetilbud?: FaktaFlyttetilbud[];
}

export interface FaktaUtgifterEgenFlytting {
    avstand: number;
    drivstoffType: Drivstofftype;
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

export type UtgifterDekketPåAnnenMåte = 'JA_HELE' | 'JA_DELER' | 'NEI';

export const utgifterDekketPåAnnenMåteTilTekst: Record<UtgifterDekketPåAnnenMåte, string> = {
    JA_HELE: 'Ja, hele utgiften blir dekket',
    JA_DELER: 'Ja, deler av utgiften blir dekket',
    NEI: 'Nei',
};
