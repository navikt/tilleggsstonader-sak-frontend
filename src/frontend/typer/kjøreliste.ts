export interface ReisevurderingPrivatBil {
    reiseId: string;
    uker: UkeVurdering[];
}

export interface UkeVurdering {
    ukenummer: number;
    fraDato: string;
    tilDato: string;
    status: UkeStatus;
    avvik?: AvvikUke;
    behandletDato?: string;
    kjørelisteInnsendtDato?: string; // null hvis kjøreliste ikke er mottatt
    kjørelisteId?: string; // null hvis kjøreliste ikke er mottatt
    dager: Dag[];
}

interface AvvikUke {
    typeAvvik: TypeAvvikUke;
    avviksMelding: string;
}

export interface Dag {
    dato: string;
    ukedag: string; // avklar om faktisk trenger, eller om frontend skal mappe ut fra dag
    kjørelisteDag?: KjørelisteDag;
    avklartDag?: AvklartDag;
}

interface KjørelisteDag {
    harKjørt: boolean;
    parkeringsutgift?: number;
}

interface AvklartDag {
    godkjentGjennomførtKjøring: boolean;
    automatiskVurdering: UtfyltDagAutomatiskVurdering;
    avvik: TypeAvvikDag[];
    begrunnelse?: string; // må fylles ut om avvik?
    parkeringsutgift?: number;
}

export enum UkeStatus {
    OK_AUTOMATISK = 'OK_AUTOMATISK', // brukes hvis automatisk godkjent
    OK_MANUELT = 'OK_MANUELT', // brukes hvis saksbehandler godtar avvik
    AVVIK = 'AVVIK', // parkeringsutgifter/for mange dager etc. saksbehandler må ta stilling til uka
    IKKE_MOTTATT_KJØRELISTE = 'IKKE_MOTTATT_KJØRELISTE',
}

export enum UtfyltDagResultat {
    UTBETALING = 'UTBETALING',
    IKKE_UTBETALING = 'IKKE_UTBETALING',
}

export enum UtfyltDagAutomatiskVurdering {
    OK = 'OK',
    AVVIK = 'AVVIK',
}

export enum TypeAvvikDag {
    FOR_HØY_PARKERINGSUTGIFT = 'FOR_HØY_PARKERINGSUTGIFT',
    HELLIDAG_ELLER_HELG = 'HELLIDAG_ELLER_HELG',
}

export enum TypeAvvikUke {
    FLERE_REISEDAGER_ENN_I_RAMMEVEDTAK = 'FLERE_REISEDAGER_ENN_I_RAMMEVEDTAK',
}
