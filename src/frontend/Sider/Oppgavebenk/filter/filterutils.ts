import { OppgaveRequest } from '../typer/oppgave';

export const oppdaterFilter = (
    object: OppgaveRequest,
    key: keyof OppgaveRequest,
    val?: string | number | boolean
): OppgaveRequest => {
    if (!val || val === '') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: setNull, ...remainder } = object;
        // @ts-ignore
        return remainder;
    }
    return {
        ...object,
        [key]: val,
    };
};
