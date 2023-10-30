import { FortroligEnhet, IkkeFortroligEnhet } from './enhet';
import { Oppgavetype, Prioritet } from './oppgavetema';

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

export type BehandlingstemaStønadstype = 'ab0177' | 'ab0028' | 'ab0071';
export type Behandlingstema = BehandlingstemaStønadstype | 'ab0007';

export const behandlingstemaStønadstypeTilTekst: Record<BehandlingstemaStønadstype, string> = {
    ab0071: 'Overgangsstønad',
    ab0177: 'Skolepenger',
    ab0028: 'Barnetilsyn',
};

export const behandlingstemaTilTekst: Record<Behandlingstema, string> = {
    ...behandlingstemaStønadstypeTilTekst,
    ab0007: 'Tilbakekreving',
};

export type OppgavetypeTilbakekreving = 'ae0161';
export type OppgavetypeKlage = 'ae0058';
export type OppgaveBehandlingstype = OppgavetypeTilbakekreving | OppgavetypeKlage;

export const oppgavetypeTilbakekreving: OppgavetypeTilbakekreving = 'ae0161';
export const oppgavetypeKlage: OppgavetypeKlage = 'ae0058';

export const oppgaveBehandlingstypeTilTekst: Record<OppgaveBehandlingstype, string> = {
    ae0161: 'Tilbakekreving',
    ae0058: 'Klage',
};
