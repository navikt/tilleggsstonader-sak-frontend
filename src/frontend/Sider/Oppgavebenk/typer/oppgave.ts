import { FortroligEnhet, IkkeFortroligEnhet } from './enhet';
import { Oppgavetype } from './oppgavetema';

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

export type BehandlingstemaStønadstype = 'ab0177' | 'ab0028' | 'ab0071';
export type Behandlingstema = BehandlingstemaStønadstype | 'ab0007';

export const behandlingstemaStønadstypeTilTekst: Record<BehandlingstemaStønadstype, string> = {
    ab0071: 'Overgangsstønad',
    ab0177: 'Skolepenger',
    ab0028: 'Barnetilsyn',
};
