import { useCallback } from 'react';

import { useApp } from '../context/AppContext';
import { Oppgave } from '../Sider/Oppgavebenk/typer/oppgave';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../typer/ressurs';

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
                        if (res.httpStatus === 409) {
                            const feilkode = res.feilkode ? ` Feilkode: ${res.feilkode}` : '';
                            return Promise.reject(
                                new Error(
                                    `Oppgaven har endret eier, beskrivelse eller annet siden siste du oppdaterte oppgavebenken. For å kunne gjøre endringer må du hente oppgaver på nytt.${feilkode}`
                                )
                            );
                        } else {
                            return Promise.reject(new Error(res.frontendFeilmelding));
                        }
                    }
                })
                .finally(() => settLaster(false));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
