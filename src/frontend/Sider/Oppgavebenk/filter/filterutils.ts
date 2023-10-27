import { FortroligEnhet, IkkeFortroligEnhet } from '../typer/enhet';
import { OppgaveRequest } from '../typer/oppgave';

export const oppdaterFilter = (
    object: OppgaveRequest,
    key: keyof OppgaveRequest,
    val?: string | number
): OppgaveRequest => {
    if (!val || val === '') {
        // eslint-disable-next-line
        const { [key]: setNull, ...remainder } = object;
        return remainder;
    }
    return {
        ...object,
        [key]: val,
    };
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
