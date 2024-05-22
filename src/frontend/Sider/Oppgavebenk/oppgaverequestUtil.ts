import { OppgaveRequest } from './typer/oppgave';

const OPPGAVE_SIDE_STØRRELSE = 15;

export const defaultSortering: Pick<OppgaveRequest, 'offset' | 'limit' | 'order' | 'orderBy'> = {
    offset: 0,
    limit: OPPGAVE_SIDE_STØRRELSE,
    orderBy: 'OPPRETTET_TIDSPUNKT',
    order: 'ASC',
};

export const nullstillSortering = (oppgaveRequest: OppgaveRequest): OppgaveRequest => ({
    ...oppgaveRequest,
    ...defaultSortering,
});

export const defaultOppgaveRequest: OppgaveRequest = {
    ...defaultSortering,
};
