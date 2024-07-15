import {
    Behandlingstema,
    Oppgave,
    OppgaveBehandlingstype,
    OppgaverResponse,
    behandlingstemaTilTekst,
    oppgaveBehandlingstypeTilTekst,
} from './typer/oppgave';
import { Oppgavetype } from './typer/oppgavetema';
import { Saksbehandler } from '../../utils/saksbehandler';
import { Ressurs, RessursStatus } from '../../typer/ressurs';

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

export const utledTypeBehandling = (
    behandlingstype?: OppgaveBehandlingstype,
    behandlingstema?: Behandlingstema
) => {
    const behandlingstypeTekst = behandlingstype && oppgaveBehandlingstypeTilTekst[behandlingstype];
    const behandlingstemaTekst = behandlingstema && behandlingstemaTilTekst[behandlingstema];

    return behandlingstype
        ? behandlingstema
            ? behandlingstypeTekst + ' - ' + behandlingstemaTekst
            : behandlingstypeTekst
        : behandlingstemaTekst;
};

export const oppdaterOppgaveIOppgaveResponse = (
    eksisterendeOppgaver: Ressurs<OppgaverResponse>,
    oppdatertOppgave: Oppgave
) => {
    if (eksisterendeOppgaver.status === RessursStatus.SUKSESS) {
        return {
            ...eksisterendeOppgaver,
            data: {
                ...eksisterendeOppgaver.data,
                oppgaver: eksisterendeOppgaver.data.oppgaver.map((oppgave) => {
                    if (
                        oppgave.id === oppdatertOppgave.id &&
                        oppgave.versjon < oppdatertOppgave.versjon
                    ) {
                        return oppdatertOppgave;
                    } else {
                        return oppgave;
                    }
                }),
            },
        };
    } else {
        return eksisterendeOppgaver;
    }
};
