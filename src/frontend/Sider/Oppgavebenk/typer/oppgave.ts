import { FortroligEnhet, IkkeFortroligEnhet } from './enhet';
import { Oppgavetype, Prioritet } from './oppgavetema';

export interface OppgaveResponse {
    behandlingId: string;
    gsakId: string;
}

export interface OppgaveRequest {
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    enhet?: FortroligEnhet | IkkeFortroligEnhet;
    mappeId?: number;
    saksbehandler?: string;
    journalpostId?: string;
    tilordnetRessurs?: string;
    tildeltRessurs?: boolean;
    opprettetFom?: string;
    opprettetTom?: string;
    fristFom?: string;
    fristTom?: string;
    erUtenMappe?: boolean;
    ident?: string;
}

export interface OppgaverResponse {
    antallTreffTotalt: number;
    oppgaver: Oppgave[];
}

export interface Oppgave {
    id: number;
    identer?: IOppgaveIdent[];
    tildeltEnhetsnr?: string;
    endretAvEnhetsnr?: string;
    eksisterendeOppgaveId?: string;
    opprettetAvEnhetsnr?: string;
    journalpostId?: string;
    journalpostkilde?: string;
    behandlesAvApplikasjon: string;
    saksreferanse?: string;
    bnr?: string;
    samhandlernr?: string;
    aktoerId?: string;
    orgnr?: string;
    tilordnetRessurs?: string;
    beskrivelse?: string;
    temagruppe?: string;
    tema?: string;
    behandlingstema?: Behandlingstema;
    oppgavetype?: Oppgavetype;
    behandlingstype?: OppgaveBehandlingstype;
    versjon: number;
    mappeId?: number;
    fristFerdigstillelse?: string;
    aktivDato?: string;
    opprettetTidspunkt?: string;
    opprettetAv?: string;
    endretAv?: string;
    ferdigstiltTidspunkt?: string;
    endretTidspunkt?: string;
    prioritet?: Prioritet;
    status?: string;
}

export interface IOppgaveIdent {
    ident: string;
    gruppe: IdentGruppe;
}

export enum IdentGruppe {
    AKTOERID = 'AKTOERID',
    FOLKEREGISTERIDENT = 'FOLKEREGISTERIDENT',
    NPID = 'NPID',
    ORGNR = 'ORGNR',
    SAMHANDLERNR = 'SAMHANDLERNR',
}

export enum Behandlingstema {
    Tilsyn_Barn = 'ab0300',
}

export const behandlingstemaTilTekst: Record<Behandlingstema, string> = {
    ab0300: 'Tilsyn barn',
};

export enum OppgaveBehandlingstype {
    Feilutbetaling = 'ae0161',
    Klage = 'ae0058',
    Anke = 'ae0046',
    Utland = 'ae0106',
}

export const oppgaveBehandlingstypeTilTekst: Record<OppgaveBehandlingstype, string> = {
    ae0046: 'Anke',
    ae0106: 'Utland',
    ae0161: 'Feilutbetaling',
    ae0058: 'Klage',
};
