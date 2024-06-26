import { Oppgave } from './typer/oppgave';
import { Oppgavetype } from './typer/oppgavetema';
import { Saksbehandler } from '../../utils/saksbehandler';

export const JOURNALPOST_QUERY_STRING = 'journalpostId';
export const OPPGAVEID_QUERY_STRING = 'oppgaveId';

const behandlingssakerForSaksbehandling: Oppgavetype[] = ['BEH_SAK', 'GOD_VED', 'BEH_UND_VED'];

export const oppgaveErSaksbehandling = (oppgave: Oppgave): boolean => {
    const { behandlesAvApplikasjon, oppgavetype } = oppgave;
    return !!(
        behandlesAvApplikasjon === 'tilleggsstonader-sak' &&
        oppgavetype &&
        behandlingssakerForSaksbehandling.includes(oppgavetype) &&
        oppgave.behandlingId
    );
};

export const saksbehandlerHarSendtTilGodkjenneVedtak = (
    oppgave: Oppgave,
    saksbehandler: Saksbehandler
): boolean =>
    oppgave.oppgavetype === 'GOD_VED' &&
    oppgave.sendtTilTotrinnskontrollAv === saksbehandler.navIdent;

export const oppgaveErJournalføring = (oppgave: Oppgave) => oppgave.oppgavetype === 'JFR';

export const oppgaveErJournalføringKlage = (oppgave: Oppgave) =>
    oppgave.oppgavetype === 'JFR' && oppgave.behandlingstype === 'ae0058';

export const lagJournalføringUrl = (journalpostId: string, oppgaveId: string | number): string => {
    return `/journalfor?${JOURNALPOST_QUERY_STRING}=${journalpostId}&${OPPGAVEID_QUERY_STRING}=${oppgaveId}`;
};
