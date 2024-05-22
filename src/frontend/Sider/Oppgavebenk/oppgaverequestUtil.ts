import { FortroligEnhet, IkkeFortroligEnhet } from './typer/enhet';
import { OppgaveRequest, OppgaverResponse } from './typer/oppgave';

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

export const oppgaveRequestMedDefaultEnhet = (
    oppgaveRequest: OppgaveRequest,
    harSaksbehandlerStrengtFortroligRolle: boolean
): OppgaveRequest => {
    if (harSaksbehandlerStrengtFortroligRolle) {
        return {
            ...oppgaveRequest,
            enhet: FortroligEnhet.VIKAFOSSEN,
        };
    } else {
        const enhet = oppgaveRequest.enhet;
        return {
            ...oppgaveRequest,
            enhet: enhet || IkkeFortroligEnhet.NAY,
        };
    }
};

export const utledSide = (oppgaveRequest: OppgaveRequest | undefined) =>
    oppgaveRequest?.offset ? Math.ceil(oppgaveRequest.offset / OPPGAVE_SIDE_STØRRELSE) + 1 : 1;

export const utledAntallSider = (oppgaverResponse: OppgaverResponse) =>
    Math.ceil(oppgaverResponse.antallTreffTotalt / OPPGAVE_SIDE_STØRRELSE);
