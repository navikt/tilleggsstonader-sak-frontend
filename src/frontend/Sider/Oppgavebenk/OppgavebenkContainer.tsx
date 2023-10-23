import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Oppgavefiltrering } from './filter/Oppgavefiltrering';
import Oppgavetabell from './Oppgavetabell';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { useApp } from '../../context/AppContext';
import { OppgaveProvider, useOppgave } from '../../context/OppgaveContext';
import DataViewer from '../../komponenter/DataViewer';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import { AlertInfo } from '../../komponenter/Visningskomponenter/Alerts';
import { erProd } from '../../utils/miljø';

const InfoVisning = styled(AlertInfo)`
    margin-top: 2rem;
    max-width: 60rem;

    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

const Oppgavebenk = () => {
    const { feilmelding, oppgaveRessurs } = useOppgave();
    return (
        <div>
            OppgaveBenk
            <Oppgavefiltrering />
            <DataViewer response={{ oppgaver: oppgaveRessurs }}>
                {({ oppgaver }) => <Oppgavetabell oppgaver={oppgaver.oppgaver} />}
            </DataViewer>
            <Feilmelding>{feilmelding}</Feilmelding>
        </div>
    );
};

const OppgavebenkContainer: React.FC = () => {
    const { erSaksbehandler } = useApp();

    useEffect(() => {
        document.title = 'Oppgavebenk';
    }, []);

    if (!erSaksbehandler) {
        return (
            <InfoVisning>
                Oppgavebenken er ikke tilgjengelig for veiledere. Benytt fødselsnummer i søkefelt
                for å finne informasjon om en person
            </InfoVisning>
        );
    }

    return (
        <div>
            {!erProd() && <OpprettDummyBehandling />}
            <OppgaveProvider>
                <Oppgavebenk />
            </OppgaveProvider>
        </div>
    );
};

export default OppgavebenkContainer;
