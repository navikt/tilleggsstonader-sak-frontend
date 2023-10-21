import { isBefore } from 'date-fns';

import { FortroligEnhet, IkkeFortroligEnhet } from '../typer/enhet';
import { Mappe } from '../typer/mappe';
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

export const sorterMapperPåNavn = (a: Mappe, b: Mappe) => {
    if (a.navn > b.navn) return 1;
    else if (a.navn < b.navn) return -1;
    return 0;
};

export const datoFeil = (valgtDatoFra?: string, valgtDatoTil?: string): string | undefined => {
    if (!valgtDatoFra || !valgtDatoTil) {
        return undefined;
    }
    if (isBefore(new Date(valgtDatoTil), new Date(valgtDatoFra))) {
        return 'Til dato må vare etter til fra dato';
    }
    return undefined;
};
