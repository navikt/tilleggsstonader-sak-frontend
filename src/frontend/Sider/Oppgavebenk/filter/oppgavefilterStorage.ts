import { dagensDato } from '../../../utils/dato';
import { Saksbehandler } from '../../../utils/saksbehandler';
import {
    defaultOppgaveRequest,
    defaultSortering,
    oppgaveRequestMedDefaultEnhet,
} from '../oppgaverequestUtil';
import { OppgaveRequest } from '../typer/oppgave';

export const oppgaveRequestKeyPrefix = 'oppgaveFiltreringRequest';

export const oppgaveRequestKey = (innloggetIdent: string): string => {
    return oppgaveRequestKeyPrefix + innloggetIdent;
};

export const lagreTilLocalStorage = (key: string, request: OppgaveRequest): void => {
    try {
        localStorage.setItem(key, JSON.stringify({ ...request, _datoLagret: dagensDato() }));
    } catch {
        // Ingen skade skjedd
    }
};

export const hentFraLocalStorage = (
    key: string,
    fallbackVerdi: OppgaveRequest
): Partial<OppgaveRequest> => {
    try {
        const request = localStorage.getItem(key);
        if (request) {
            // fjerner _datoLagret før obj returneres
            const { _datoLagret, ...obj } = JSON.parse(request);
            if (_datoLagret === dagensDato()) {
                return obj;
            }
        }
        return fallbackVerdi;
    } catch {
        return fallbackVerdi;
    }
};

export const hentLagretOppgaveRequest = (
    saksbehandler: Saksbehandler,
    harSaksbehandlerStrengtFortroligRolle: boolean
): OppgaveRequest => {
    const fraLocalStorage = hentFraLocalStorage(
        oppgaveRequestKey(saksbehandler.navIdent),
        defaultOppgaveRequest
    );

    const fraLocalStorageMedDefaultVerdier: OppgaveRequest = {
        ...fraLocalStorage,
        limit: fraLocalStorage.limit ?? defaultSortering.limit,
        offset: fraLocalStorage.offset ?? defaultSortering.offset,
        order: defaultSortering.order,
        orderBy: defaultSortering.orderBy,
        oppgaverPåVent: defaultOppgaveRequest.oppgaverPåVent,
    };

    return oppgaveRequestMedDefaultEnhet(
        fraLocalStorageMedDefaultVerdier,
        harSaksbehandlerStrengtFortroligRolle
    );
};
