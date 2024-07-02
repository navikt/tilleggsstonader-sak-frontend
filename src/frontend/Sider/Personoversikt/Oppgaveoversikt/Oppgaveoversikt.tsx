import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { OppgaveProvider, useOppgave } from '../../../context/OppgaveContext';
import { usePersonopplysninger } from '../../../context/PersonopplysningerContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { harStrengtFortroligRolle } from '../../../utils/roller';
import {
    defaultOppgaveRequest,
    oppgaveRequestMedDefaultEnhet,
} from '../../Oppgavebenk/oppgaverequestUtil';
import Oppgavetabell from '../../Oppgavebenk/Oppgavetabell';
import { OppgaveRequest } from '../../Oppgavebenk/typer/oppgave';

const AlertContainer = styled.div`
    margin: 2rem;
    width: fit-content;
`;

/**
 * TODO håndter at det kan gjelde egne ansatt
 * TODO håndter at backend skal håndtere oppgaver: Alle/satt på vent/ikke satt på vent
 */
const Personoppgaver: React.FC = () => {
    const { saksbehandler, appEnv } = useApp();
    const {
        personopplysninger: { personIdent },
    } = usePersonopplysninger();
    const { feilmelding, oppgaveRessurs, hentOppgaver } = useOppgave();

    const harSaksbehandlerStrengtFortroligRolle = harStrengtFortroligRolle(appEnv, saksbehandler);
    const [oppgaveRequest, settOppgaveRequest] = useState<OppgaveRequest>({
        ...oppgaveRequestMedDefaultEnhet(
            defaultOppgaveRequest,
            harSaksbehandlerStrengtFortroligRolle
        ),
        ident: personIdent,
    });

    useEffect(() => {
        hentOppgaver(oppgaveRequest);
    }, []);

    return (
        <>
            <DataViewer response={{ oppgaver: oppgaveRessurs }}>
                {({ oppgaver }) => (
                    <Oppgavetabell
                        oppgaverResponse={oppgaver}
                        oppgaveRequest={oppgaveRequest}
                        settOppgaveRequest={settOppgaveRequest}
                    />
                )}
            </DataViewer>
            <Feilmelding>{feilmelding}</Feilmelding>
        </>
    );
};

const Oppgaveoversikt: React.FC = () => {
    const { erSaksbehandler } = useApp();

    if (!erSaksbehandler) {
        return (
            <AlertContainer>
                <Alert variant={'info'}>
                    Oppgavebenken er ikke tilgjengelig for veiledere. Benytt fødselsnummer i
                    søkefelt for å finne informasjon om en person
                </Alert>
            </AlertContainer>
        );
    }

    return (
        <OppgaveProvider>
            <Personoppgaver />
        </OppgaveProvider>
    );
};

export default Oppgaveoversikt;
