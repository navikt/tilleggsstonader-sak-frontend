import { oppgaveRequestMedDefaultEnhet } from './filterutils';
import { Saksbehandler } from '../../../utils/saksbehandler';
import { defaultOppgaveRequest, defaultSortering } from '../oppgaverequestUtil';
import { OppgaveRequest } from '../typer/oppgave';

export const oppgaveRequestKeyPrefix = 'oppgaveFiltreringRequest';

export const oppgaveRequestKey = (innloggetIdent: string): string => {
    return oppgaveRequestKeyPrefix + innloggetIdent;
};

export const lagreTilLocalStorage = <T>(key: string, request: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(request));
    } catch {
        // Ingen skade skjedd
    }
};

export const hentFraLocalStorage = <T>(key: string, fallbackVerdi: T): T => {
    try {
        const request = localStorage.getItem(key);
        return request ? JSON.parse(request) : fallbackVerdi;
    } catch {
        return fallbackVerdi;
    }
};

export const hentLagretOppgaveRequest = (
    saksbehandler: Saksbehandler,
    harSaksbehandlerStrengtFortroligRolle: boolean
): OppgaveRequest => {
    const fraLocalStorage = hentFraLocalStorage<Partial<OppgaveRequest>>(
        oppgaveRequestKey(saksbehandler.navIdent),
        defaultOppgaveRequest
    );

    const fraLocalStorageMedDefaultVerdier: OppgaveRequest = {
        ...fraLocalStorage,
        limit: fraLocalStorage.limit ?? defaultSortering.limit,
        offset: fraLocalStorage.offset ?? defaultSortering.offset,
        order: defaultSortering.order,
        orderBy: defaultSortering.orderBy,
    };

    return oppgaveRequestMedDefaultEnhet(
        fraLocalStorageMedDefaultVerdier,
        harSaksbehandlerStrengtFortroligRolle
    );
};
