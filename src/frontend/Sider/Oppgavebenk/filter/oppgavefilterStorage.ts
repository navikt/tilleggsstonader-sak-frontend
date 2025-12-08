import { dagensDato } from '../../../utils/dato';
import { AppEnv } from '../../../utils/env';
import { Saksbehandler } from '../../../utils/saksbehandler';
import {
    defaultOppgaveRequest,
    defaultSortering,
    oppgaveRequestMedDefaultEnhet,
} from '../oppgaverequestUtil';
import { hentEnheterBrukerHarTilgangTil } from '../typer/enhet';
import { OppgaveRequest } from '../typer/oppgave';

export const oppgaveRequestKeyPrefix = 'oppgaveFiltreringRequest';

export const oppgaveRequestKey = (innloggetIdent: string): string => {
    return oppgaveRequestKeyPrefix + innloggetIdent;
};

export const lagreTilLocalStorage = (key: string, request: Partial<OppgaveRequest>): void => {
    try {
        localStorage.setItem(key, JSON.stringify({ ...request, _datoLagret: dagensDato() }));
    } catch {
        // Ingen skade skjedd
    }
};

export const hentFraLocalStorage = (
    key: string,
    fallbackVerdi: Partial<OppgaveRequest>
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
    appEnv: AppEnv,
    saksbehandler: Saksbehandler
): OppgaveRequest => {
    const fraLocalStorage = hentFraLocalStorage(
        oppgaveRequestKey(saksbehandler.navIdent),
        defaultOppgaveRequest
    );

    const fraLocalStorageMedDefaultVerdier: OppgaveRequest = {
        ...fraLocalStorage,
        limit: fraLocalStorage.limit ?? defaultSortering.limit,
        offset: fraLocalStorage.offset ?? defaultSortering.offset,
        oppgaverPåVent: fraLocalStorage.oppgaverPåVent ?? defaultOppgaveRequest.oppgaverPåVent,
        order: defaultSortering.order,
        orderBy: defaultSortering.orderBy,
    };

    const gyldigeEnheterForBruker = hentEnheterBrukerHarTilgangTil(appEnv, saksbehandler);

    return oppgaveRequestMedDefaultEnhet(fraLocalStorageMedDefaultVerdier, gyldigeEnheterForBruker);
};
