import { Enheter, FortroligEnhet } from './typer/enhet';
import { OppgaveRequest, OppgaverResponse } from './typer/oppgave';

export const OPPGAVE_SIDE_STØRRELSE = 15;

export const defaultSortering: Pick<OppgaveRequest, 'offset' | 'limit' | 'order' | 'orderBy'> = {
    offset: 0,
    limit: OPPGAVE_SIDE_STØRRELSE,
    orderBy: 'FRIST',
    order: 'ASC',
};

export const nullstillSortering = (oppgaveRequest: OppgaveRequest): OppgaveRequest => ({
    ...oppgaveRequest,
    ...defaultSortering,
});

export const defaultOppgaveRequest: OppgaveRequest = {
    ...defaultSortering,
    oppgaverPåVent: false,
};

export const oppgaveRequestMedDefaultEnhet = (
    oppgaveRequest: OppgaveRequest,
    gyldigeEnheterForBruker: Enheter[]
): OppgaveRequest => {
    if (gyldigeEnheterForBruker.some((enhet) => enhet === FortroligEnhet.VIKAFOSSEN)) {
        return {
            ...oppgaveRequest,
            enhet: FortroligEnhet.VIKAFOSSEN,
        };
    } else {
        const enhet = oppgaveRequest.enhet;
        return {
            ...oppgaveRequest,
            enhet: enhet || gyldigeEnheterForBruker[0],
        };
    }
};

export const utledSide = (oppgaveRequest: OppgaveRequest | undefined) =>
    oppgaveRequest?.offset ? Math.ceil(oppgaveRequest.offset / OPPGAVE_SIDE_STØRRELSE) + 1 : 1;

export const utledAntallSider = (oppgaverResponse: OppgaverResponse) =>
    Math.ceil(oppgaverResponse.antallTreffTotalt / OPPGAVE_SIDE_STØRRELSE);
