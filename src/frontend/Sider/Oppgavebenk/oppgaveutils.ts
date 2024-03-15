import { Oppgave } from './typer/oppgave';
import { Oppgavetype } from './typer/oppgavetema';

export const JOURNALPOST_QUERY_STRING = 'journalpostId';
export const GJELDER_KLAGE_QUERY_STRING = 'gjelderKlage';
export const OPPGAVEID_QUERY_STRING = 'oppgaveId';

const behandlingssakerForSaksbehandling: Oppgavetype[] = ['BEH_SAK', 'GOD_VED', 'BEH_UND_VED'];
export const oppgaveErSaksbehandling = (oppgave: Oppgave) => {
    const { behandlesAvApplikasjon, oppgavetype } = oppgave;
    return (
        behandlesAvApplikasjon === 'tilleggsstonader-sak' &&
        oppgavetype &&
        behandlingssakerForSaksbehandling.includes(oppgavetype)
    );
};

export const oppgaveErJournalføring = (oppgave: Oppgave) => oppgave.oppgavetype === 'JFR';

export const oppgaveErJournalføringKlage = (oppgave: Oppgave) =>
    oppgave.oppgavetype === 'JFR' && oppgave.behandlingstype === 'ae0058';

export const lagJournalføringUrl = (
    journalpostId: string,
    oppgaveId: string | number,
    gjelderKlage?: boolean
): string => {
    return `/journalfor?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}&gjelderKlage=${gjelderKlage}`;
};
