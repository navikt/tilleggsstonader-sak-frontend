import { useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useOppgave } from './OppgaveContext';
import { hentLagretOppgaveRequest } from '../Sider/Oppgavebenk/filter/oppgavefilterStorage';
import { defaultOppgaveRequest } from '../Sider/Oppgavebenk/oppgaverequestUtil';
import { OppgaveRequest } from '../Sider/Oppgavebenk/typer/oppgave';
import { harStrengtFortroligRolle } from '../utils/roller';

export const [OppgaveFilterProvider, useOppgaveFilter] = constate(() => {
    const { saksbehandler, appEnv } = useApp();
    const { hentOppgaver } = useOppgave();
    const [lasterOppgaveRequestFraLocaleStorage, settLasterOppgaveRequestFraLocaleStorage] =
        useState<boolean>(true);
    const [oppgaveRequest, settOppgaveRequest] = useState<OppgaveRequest>(defaultOppgaveRequest);

    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(appEnv, saksbehandler);

    useEffect(() => {
        const lagretFiltrering = hentLagretOppgaveRequest(
            saksbehandler,
            harSaksbehandlerStrengtFortroligRolle
        );
        settOppgaveRequest(lagretFiltrering);
        settLasterOppgaveRequestFraLocaleStorage(false);
        hentOppgaver(lagretFiltrering);
    }, [hentOppgaver, harSaksbehandlerStrengtFortroligRolle, saksbehandler]);

    return {
        lasterOppgaveRequestFraLocaleStorage,
        oppgaveRequest,
        settOppgaveRequest,
    };
});
