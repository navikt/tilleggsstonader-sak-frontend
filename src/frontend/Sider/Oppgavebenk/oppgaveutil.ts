import { OppgaveRequest } from './typer/oppgave';

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
