import { Oppgave, oppgavetypeKlage, oppgavetypeTilbakekreving } from './typer/oppgave';
import { Oppgavetype } from './typer/oppgavetema';

const behandlingssakerForSaksbehandling: Oppgavetype[] = ['BEH_SAK', 'GOD_VED', 'BEH_UND_VED'];
export const oppgaveErSaksbehandling = (oppgave: Oppgave) => {
    const { behandlesAvApplikasjon, oppgavetype } = oppgave;
    return (
        behandlesAvApplikasjon === 'tilleggsstonader-sak' &&
        oppgavetype &&
        behandlingssakerForSaksbehandling.includes(oppgavetype)
    );
};
export const oppgaveErTilbakekreving = (oppgave: Oppgave) => {
    return (
        // oppgave.behandlingstema === 'ab0071' && //TODO: Når vi får behandlingstema på tilbakekrevingsoppgaver må denne sjekken inkluderes
        oppgave.behandlesAvApplikasjon === 'familie-tilbake' &&
        oppgave.behandlingstype === oppgavetypeTilbakekreving
    );
};

export const oppgaveErKlage = (oppgave: Oppgave) =>
    oppgave.behandlesAvApplikasjon === 'tilleggsstonader-klage' &&
    oppgave.behandlingstype === oppgavetypeKlage;

export const oppgaveErJournalførKlage = (oppgave: Oppgave) =>
    oppgave.oppgavetype === 'JFR' && oppgave.behandlingstype === oppgavetypeKlage;

export const oppgaveKanJournalføres = (oppgave: Oppgave) => oppgave.oppgavetype === 'JFR';
