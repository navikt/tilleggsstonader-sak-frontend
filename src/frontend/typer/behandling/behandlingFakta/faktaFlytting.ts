import { JaNei } from '../../common';

export interface FlyttingDetaljer {
    årsak?: EnumFelt<Flytteårsak> | null;
    flyttedato?: VerdiFelt<string> | null;
    adresse?: Adresse | null;
    flyttemåte?: EnumFelt<Flyttemåte> | null;
    utgifterDekketPåAnnenMåte?: EnumFelt<JaNei> | null;
    utgifterEgenFlytting?: UtgifterEgenFlytting | null;
    flyttebyrå?: Flyttebyrå | null;
}

interface EnumFelt<T> {
    label: string;
    verdi: T;
    svarTekst: string;
    alternativer: string[];
}

interface VerdiFelt<T> {
    verdi: T;
    label: string;
}

interface Adresse {
    land?: SelectFelt<string> | null;
    gateadresse?: VerdiFelt<string> | null;
    postnummer?: VerdiFelt<string> | null;
    poststed?: VerdiFelt<string> | null;
}

interface SelectFelt<T> {
    label: string;
    verdi: T;
    svarTekst: string;
}

interface UtgifterEgenFlytting {
    avstand?: VerdiFelt<number> | null;
    hengerleie?: VerdiFelt<number> | null;
    bom?: VerdiFelt<number> | null;
    parkering?: VerdiFelt<number> | null;
    ferje?: VerdiFelt<number> | null;
    annet?: VerdiFelt<number> | null;
}

interface Flyttebyrå {
    tilbud: FlyttebyråTilbud[];
}

interface FlyttebyråTilbud {
    navn?: VerdiFelt<string> | null;
    beløp?: VerdiFelt<number> | null;
}

type Flytteårsak = 'NY_JOBB' | 'AKTIVITET';
type Flyttemåte = 'FLYTTER_SELV' | 'FLYTTEBYRÅ';
