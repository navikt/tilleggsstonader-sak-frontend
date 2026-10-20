import { JaNei } from '../../common';

export interface FlyttingDetaljer {
    årsak?: EnumFelt<Flytteårsak> | null;
    flyttedato?: VerdiFelt<string> | null;
    førsteArbeidsdag?: VerdiFelt<string> | null;
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
    avstand?: VerdiFelt<string> | null;
    hengerleie?: VerdiFelt<string> | null;
    bom?: VerdiFelt<string> | null;
    parkering?: VerdiFelt<string> | null;
    ferje?: VerdiFelt<string> | null;
    annet?: VerdiFelt<string> | null;
}

interface Flyttebyrå {
    tilbud1?: FlyttebyråTilbud | null;
    tilbud2?: FlyttebyråTilbud | null;
    valgtTilbud?: EnumFelt<ValgtTilbud> | null;
}

interface FlyttebyråTilbud {
    navn?: VerdiFelt<string> | null;
    beløp?: VerdiFelt<string> | null;
}

type Flytteårsak = 'NY_JOBB' | 'AKTIVITET';
type Flyttemåte = 'FLYTTER_SELV' | 'FLYTTEBYRÅ';
type ValgtTilbud = 'TILBUD_1' | 'TILBUD_2';
