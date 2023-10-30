import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import Oppgavetabell from './Oppgavetabell';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { useApp } from '../../context/AppContext';
import { OppgaveProvider, useOppgave } from '../../context/OppgaveContext';
import DataViewer from '../../komponenter/DataViewer';
import { Feilmelding } from '../../komponenter/Feil/Feilmelding';
import { erProd } from '../../utils/miljø';

const Container = styled.div`
    margin: 2rem;
    width: fit-content;
`;

const OppgavebenkContainer = () => {
    const { feilmelding, oppgaveRessurs, hentOppgaver } = useOppgave();
    useEffect(() => {
        hentOppgaver({});
    }, [hentOppgaver]);
    return (
        <div>
            <DataViewer response={{ oppgaver: oppgaveRessurs }}>
                {({ oppgaver }) => <Oppgavetabell oppgaver={oppgaver.oppgaver} />}
            </DataViewer>
            <Feilmelding>{feilmelding}</Feilmelding>
        </div>
    );
};

const Oppgavebenk: React.FC = () => {
    const { erSaksbehandler } = useApp();

    useEffect(() => {
        document.title = 'Oppgavebenk';
    }, []);

    if (!erSaksbehandler) {
        return (
            <Container>
                <Alert variant={'info'}>
                    Oppgavebenken er ikke tilgjengelig for veiledere. Benytt fødselsnummer i
                    søkefelt for å finne informasjon om en person
                </Alert>
            </Container>
        );
    }

    return (
        <div>
            {!erProd() && <OpprettDummyBehandling />}
            <OppgaveProvider>
                <OppgavebenkContainer />
            </OppgaveProvider>
        </div>
    );
};

export default Oppgavebenk;
