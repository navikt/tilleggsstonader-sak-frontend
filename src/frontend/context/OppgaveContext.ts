import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { Mappe, tomMappeListe } from '../Sider/Oppgavebenk/typer/mappe';
import { Oppgave, OppgaveRequest, OppgaverResponse } from '../Sider/Oppgavebenk/typer/oppgave';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';

export const [OppgaveProvider, useOppgave] = constate(() => {
    const { request } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] = useState<Ressurs<OppgaverResponse>>(
        byggTomRessurs()
    );
    const [mapper, settMapper] = useState<Mappe[]>(tomMappeListe);
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    useEffect(() => {
        request<Mappe[], null>(`/api/sak/oppgave/mapper`).then((ressurs) => {
            ressurs.status === RessursStatus.SUKSESS && settMapper(ressurs.data);
        });
    }, [request]);

    const hentOppgaver = useCallback(
        (data: OppgaveRequest) => {
            request<OppgaverResponse, OppgaveRequest>(`/api/sak/oppgave/soek`, 'POST', data).then(
                settOppgaveRessurs
            );
        },
        [request]
    );

    const oppdaterOppgaveEtterTilbakestilling = (oppdatertOppgave: Oppgave) => {
        settOppgaveRessurs((prevState) => {
            if (prevState.status === RessursStatus.SUKSESS) {
                return {
                    ...prevState,
                    data: {
                        ...prevState.data,
                        oppgaver: prevState.data.oppgaver.map((oppgave) => {
                            if (
                                oppgave.id === oppdatertOppgave.id &&
                                oppgave.versjon < oppdatertOppgave.versjon
                            ) {
                                return oppdatertOppgave;
                            } else {
                                return oppgave;
                            }
                        }),
                    },
                };
            } else {
                return prevState;
            }
        });
    };

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

    return {
        laster,
        oppgaveRessurs,
        mapper,
        hentOppgaver,
        feilmelding,
        settFeilmelding,
        fordelOppgave,
        oppdaterOppgaveEtterTilbakestilling,
    };
});
