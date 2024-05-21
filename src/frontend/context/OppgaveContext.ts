import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { oppgaveRequestMedDefaultEnhet } from '../Sider/Oppgavebenk/filter/filterutils';
import {
    hentFraLocalStorage,
    oppgaveRequestKey,
} from '../Sider/Oppgavebenk/filter/oppgavefilterStorage';
import { Oppgave, OppgaveRequest, OppgaverResponse } from '../Sider/Oppgavebenk/typer/oppgave';
import {
    byggHenterRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { harStrengtFortroligRolle } from '../utils/roller';
import { Saksbehandler } from '../utils/saksbehandler';

const hentLagretOppgaveRequest = (
    saksbehandler: Saksbehandler,
    harSaksbehandlerStrengtFortroligRolle: boolean
): OppgaveRequest => {
    const fraLocalStorage = hentFraLocalStorage<OppgaveRequest>(
        oppgaveRequestKey(saksbehandler.navIdent),
        {}
    );

    return oppgaveRequestMedDefaultEnhet(fraLocalStorage, harSaksbehandlerStrengtFortroligRolle);
};

export const [OppgaveProvider, useOppgave] = constate(() => {
    const { request, saksbehandler, appEnv } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());
    const [laster, settLaster] = useState<boolean>(false);
    const [lasterOppgaveRequestFraLokalt, settLasterOppgaveRequestFraLokalt] =
        useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const [oppgaveRequest, settOppgaveRequest] = useState<OppgaveRequest>({});

    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(appEnv, saksbehandler);

    const hentOppgaver = useCallback(
        (data: OppgaveRequest) => {
            settOppgaveRessurs(byggHenterRessurs());
            request<OppgaverResponse, OppgaveRequest>(`/api/sak/oppgave/soek`, 'POST', data).then(
                settOppgaveRessurs
            );
        },
        [request]
    );

    useEffect(() => {
        const lagretFiltrering = hentLagretOppgaveRequest(
            saksbehandler,
            harSaksbehandlerStrengtFortroligRolle
        );
        settOppgaveRequest(lagretFiltrering);
        settLasterOppgaveRequestFraLokalt(false);
        hentOppgaver(lagretFiltrering);
    }, [hentOppgaver, harSaksbehandlerStrengtFortroligRolle, saksbehandler]);

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
        laster,
        settLaster,
        oppgaveRessurs,
        hentOppgaver,
        feilmelding,
        settFeilmelding,
        tilbakestillFordeling,
        settOppgaveTilSaksbehandler,
        oppdaterOppgaveEtterTilbakestilling,
        lasterOppgaveRequestFraLokalt,
        oppgaveRequest,
        settOppgaveRequest,
    };
});
