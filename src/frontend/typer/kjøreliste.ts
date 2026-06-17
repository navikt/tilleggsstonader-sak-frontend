import { Ukedag } from '../utils/dato';
import { RammeForReiseMedPrivatBil } from './vedtak/vedtakDagligReise';

export interface ReisevurderingPrivatBil {
    reiseId: string;
    uker: UkeVurdering[];
    rammevedtak: RammeForReiseMedPrivatBil;
    forrigeRammevedtak?: RammeForReiseMedPrivatBil;
}

export interface UkeVurdering {
    ukenummer: number;
    fraDato: string;
    tilDato: string;
    endringIRammevedtakStatus: UkeEndringIRammevedtakStatus;
    status: UkeStatus;
    avvik?: AvvikUke;
    behandletDato?: string;
    kjørelisteInnsendtDato?: string; // null hvis kjøreliste ikke er mottatt
    kjørelisteId?: string; // null hvis kjøreliste ikke er mottatt
    avklartUkeId?: string; // null hvis uke ikke er avklart
    dager: Dag[];
    avklartKjørtUkeStatus: AvklartKjørtUkeStatus;
}

export interface AvvikUke {
    typeAvvik: TypeAvvikUke;
}

export interface Dag {
    dato: string;
    ukedag: Ukedag; // avklar om faktisk trenger, eller om frontend skal mappe ut fra dag
    kjørelisteDag?: KjørelisteDag;
    avklartDag?: AvklartDag;
}

interface KjørelisteDag {
    harKjørt: boolean;
    parkeringsutgift?: number;
}

export interface AvklartDag {
    automatiskVurdering?: UtfyltDagAutomatiskVurdering; // denne må kunne være undefined
    avvik?: TypeAvvikDag[];
    godkjentGjennomførtKjøring: GodkjentGjennomførtKjøring;
    begrunnelse?: string; // må fylles ut om avvik?
    parkeringsutgift?: number;
    avklartKjørtDagStatus?: AvklartKjørtDagStatus;
}

export enum UkeEndringIRammevedtakStatus {
    NY = 'NY',
    SLETTET = 'SLETTET',
    UENDRET = 'UENDRET',
}

export enum GodkjentGjennomførtKjøring {
    JA = 'JA',
    NEI = 'NEI',
    IKKE_VURDERT = 'IKKE_VURDERT',
}

export enum UkeStatus {
    OK_AUTOMATISK = 'OK_AUTOMATISK', // brukes hvis automatisk godkjent
    OK_MANUELT = 'OK_MANUELT', // brukes hvis saksbehandler godtar avvik
    AVVIK = 'AVVIK', // parkeringsutgifter/for mange dager etc. saksbehandler må ta stilling til uka
    IKKE_MOTTATT_KJØRELISTE = 'IKKE_MOTTATT_KJØRELISTE',
}

export enum AvklartKjørtUkeStatus {
    NY = 'NY', // Uke finnes ikke i forrige behandling
    ENDRET = 'ENDRET', // Uke finnes i forrige behandling, men er endret av saksbehandler (inkl. tømt innhold → gir 0 kr)
    UENDRET = 'UENDRET', // Uke er kopiert uendret fra forrige behandling
    SLETTET = 'SLETTET',
}

export enum AvklartKjørtDagStatus {
    NY = 'NY',
    ENDRET = 'ENDRET',
    UENDRET = 'UENDRET',
    SLETTET = 'SLETTET',
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

export interface RedigerbarAvklartDag {
    dato: string;
    godkjentGjennomførtKjøring: GodkjentGjennomførtKjøring;
    parkeringsutgift?: number;
    begrunnelse?: string;
}
