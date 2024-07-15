import { useCallback } from 'react';

import { useApp } from '../context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { Oppgave } from '../Sider/Oppgavebenk/typer/oppgave';

interface HentBehandlingerResponse {
    tilbakestillFordeling: (oppgave: Oppgave) => Promise<Oppgave>;
    settOppgaveTilSaksbehandler: (oppgave: Oppgave) => Promise<Oppgave>;
}
export const useOppgaveFordeling = (
    settLaster: React.Dispatch<React.SetStateAction<boolean>>
): HentBehandlingerResponse => {
    const { request } = useApp();

    const fordelOppgave = useCallback(
        (oppgave: Oppgave, tilbakestill: boolean = false) => {
            settLaster(true);
            return request<Oppgave, null>(
                `/api/sak/oppgave/${oppgave.id}/fordel?versjon=${oppgave.versjon}&tilbakestill=${tilbakestill}`,
                'POST'
            )
                .then((res: RessursSuksess<Oppgave> | RessursFeilet) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        return Promise.resolve(res.data);
                    } else {
                        return Promise.reject(
                            new Error(
                                `Feilet fordeling av oppgave. Feil: ${res.frontendFeilmelding}`
                            )
                        );
                    }
                })
                .finally(() => settLaster(false));
        },
        [request]
    );

    const tilbakestillFordeling = useCallback(
        (oppgave: Oppgave) => {
            return fordelOppgave(oppgave, true);
        },
        [fordelOppgave]
    );

    const settOppgaveTilSaksbehandler = useCallback(
        (oppgave: Oppgave) => {
            return fordelOppgave(oppgave);
        },
        [fordelOppgave]
    );

    return {
        tilbakestillFordeling,
        settOppgaveTilSaksbehandler,
    };
};
