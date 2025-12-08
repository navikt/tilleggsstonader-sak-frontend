import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { FeilmeldingHåndterOppgave } from '../Sider/Oppgavebenk/FeilmeldingHåndterOppgaveModal';
import { hentLagretOppgaveRequest } from '../Sider/Oppgavebenk/filter/oppgavefilterStorage';
import { defaultOppgaveRequest } from '../Sider/Oppgavebenk/oppgaverequestUtil';
import { oppdaterOppgaveIOppgaveResponse } from '../Sider/Oppgavebenk/oppgaveutils';
import { Oppgave, OppgaveRequest, OppgaverResponse } from '../Sider/Oppgavebenk/typer/oppgave';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { harStrengtFortroligRolle } from '../utils/roller';

export const [OppgaveProvider, useOppgave] = constate(() => {
    const { request, saksbehandler, appEnv } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());
    const [laster, settLaster] = useState<boolean>(false);
    const [lasterOppgaveRequestFraLocaleStorage, settLasterOppgaveRequestFraLocaleStorage] =
        useState<boolean>(true);
    const [feilmeldingHåndterOppgave, settFeilmeldingHåndterOppgave] =
        useState<FeilmeldingHåndterOppgave>();

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
        const lagretFiltrering = hentLagretOppgaveRequest(appEnv, saksbehandler);
        settOppgaveRequest(lagretFiltrering);
        settLasterOppgaveRequestFraLocaleStorage(false);
        hentOppgaver(lagretFiltrering);
    }, [hentOppgaver, harSaksbehandlerStrengtFortroligRolle, saksbehandler, appEnv]);

    const oppdaterOppgaveEtterOppdatering = (oppdatertOppgave: Oppgave) => {
        settOppgaveRessurs((prevState) =>
            oppdaterOppgaveIOppgaveResponse(prevState, oppdatertOppgave)
        );
    };

    return {
        laster,
        settLaster,
        oppgaveRessurs,
        hentOppgaver,
        feilmeldingHåndterOppgave,
        settFeilmeldingHåndterOppgave,
        oppdaterOppgaveEtterOppdatering,
        lasterOppgaveRequestFraLocaleStorage,
        oppgaveRequest,
        settOppgaveRequest,
    };
});
