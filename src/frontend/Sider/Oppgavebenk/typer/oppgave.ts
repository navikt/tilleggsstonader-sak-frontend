import { FortroligEnhet, IkkeFortroligEnhet } from './enhet';
import { Oppgavetype, Prioritet } from './oppgavetema';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export interface OppgaveRequest {
    behandlingstema?: Behandlingstema;
    behandlingstype?: OppgaveBehandlingstype;
    oppgavetype?: Oppgavetype;
    enhet?: FortroligEnhet | IkkeFortroligEnhet;
    oppgaverPåVent: boolean;
    saksbehandler?: string;
    journalpostId?: string;
    tilordnetRessurs?: string;
    tildeltRessurs?: boolean;
    opprettetFom?: string;
    opprettetTom?: string;
    fristFom?: string;
    fristTom?: string;
    ident?: string;

    limit: number;
    offset: number;
    orderBy: OppgaveOrderBy;
    order: OppgaveOrder;
}

export type OppgaveOrderBy = 'OPPRETTET_TIDSPUNKT' | 'AKTIV_DATO' | 'FRIST' | 'ENDRET_TIDSPUNKT';
export type OppgaveOrder = 'ASC' | 'DESC';

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

    /*
    Ekstra felter som er lagt til i backend
     */
    navn?: string;
    behandlingId?: string;
    sendtTilTotrinnskontrollAv?: string;
    erOpphør: boolean;
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

export type Behandlingstema = 'ab0300' | 'ab0292' | 'ab0286';

export const behandlingstemaTilTekst: Record<Behandlingstema, string> = {
    ab0300: 'Tilsyn barn',
    ab0292: 'Læremidler',
    ab0286: 'Bolig/overnatting',
};

export const behandlingstemaTilStønadstype = (
    behandlingstema: Behandlingstema | undefined
): Stønadstype | undefined => {
    switch (behandlingstema) {
        case 'ab0300':
            return Stønadstype.BARNETILSYN;
        case 'ab0292':
            return Stønadstype.LÆREMIDLER;
        case 'ab0286':
            return Stønadstype.BOUTGIFTER;
        default:
            return undefined;
    }
};

export enum OppgaveBehandlingstype {
    Anke = 'ae0046',
    Klage = 'ae0058',
    Utland = 'ae0106',
    TidligereHjemsendtsak = 'ae0114',
    HjemsendtTilNyBehandling = 'ae0115',
}
export const oppgaveBehandlingstypeTilTekst: Record<OppgaveBehandlingstype, string> = {
    [OppgaveBehandlingstype.Klage]: 'Klage',
    [OppgaveBehandlingstype.Anke]: 'Anke',
    [OppgaveBehandlingstype.Utland]: 'Utland',
    [OppgaveBehandlingstype.TidligereHjemsendtsak]: 'Tidligere hjemsendt sak',
    [OppgaveBehandlingstype.HjemsendtTilNyBehandling]: 'Hjemsendt til ny behandling',
};

export interface Mappe {
    id: number;
    navn: string;
    enhetsnr: string;
    tema: string;
}
