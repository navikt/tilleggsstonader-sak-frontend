import { Oppgave } from './typer/oppgave';
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
