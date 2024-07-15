import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { hentLagretOppgaveRequest } from '../Sider/Oppgavebenk/filter/oppgavefilterStorage';
import { defaultOppgaveRequest } from '../Sider/Oppgavebenk/oppgaverequestUtil';
import { Oppgave, OppgaveRequest, OppgaverResponse } from '../Sider/Oppgavebenk/typer/oppgave';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { harStrengtFortroligRolle } from '../utils/roller';

export const [OppgaveProvider, useOppgave] = constate(() => {
    const { request, saksbehandler, appEnv } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());
    const [laster, settLaster] = useState<boolean>(false);
    const [lasterOppgaveRequestFraLocaleStorage, settLasterOppgaveRequestFraLocaleStorage] =
        useState<boolean>(true);
    const [feilmelding, settFeilmelding] = useState<string>();

    const [oppgaveRequest, settOppgaveRequest] = useState<OppgaveRequest>(defaultOppgaveRequest);

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
        settLasterOppgaveRequestFraLocaleStorage(false);
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

    return {
        laster,
        settLaster,
        oppgaveRessurs,
        hentOppgaver,
        feilmelding,
        settFeilmelding,
        oppdaterOppgaveEtterTilbakestilling,
        lasterOppgaveRequestFraLocaleStorage,
        oppgaveRequest,
        settOppgaveRequest,
    };
});
