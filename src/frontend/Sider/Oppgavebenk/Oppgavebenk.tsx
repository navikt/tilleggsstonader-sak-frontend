import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Alert, VStack } from '@navikt/ds-react';

import { FeilmeldingHåndterOppgaveModal } from './FeilmeldingHåndterOppgaveModal';
import { Oppgavefiltrering } from './filter/Oppgavefiltrering';
import Oppgavetabell from './Oppgavetabell';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { useApp } from '../../context/AppContext';
import { OppgaveProvider, useOppgave } from '../../context/OppgaveContext';
import DataViewer from '../../komponenter/DataViewer';
import SystemetLaster from '../../komponenter/SystemetLaster/SystemetLaster';
import { erProd } from '../../utils/miljø';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
    padding-bottom: 64px;
`;

const AlertContainer = styled.div`
    margin: 2rem;
    width: fit-content;
`;

const OppgavebenkContainer = () => {
    const {
        feilmeldingHåndterOppgave,
        settFeilmeldingHåndterOppgave,
        oppgaveRessurs,
        lasterOppgaveRequestFraLocaleStorage,
        oppgaveRequest,
        hentOppgaver,
    } = useOppgave();

    if (lasterOppgaveRequestFraLocaleStorage) {
        return <SystemetLaster />;
    }

    return (
        <Container>
            <Oppgavefiltrering />
            <DataViewer type={'oppgaver'} response={{ oppgaver: oppgaveRessurs }}>
                {({ oppgaver }) => <Oppgavetabell oppgaverResponse={oppgaver} />}
            </DataViewer>
            <FeilmeldingHåndterOppgaveModal
                feilmelding={feilmeldingHåndterOppgave}
                hentOppgaver={() => hentOppgaver(oppgaveRequest)}
                nullstillFeilmelding={() => settFeilmeldingHåndterOppgave(undefined)}
            />
        </Container>
    );
};

const Oppgavebenk: React.FC = () => {
    const { erSaksbehandler } = useApp();

    useEffect(() => {
        document.title = 'Oppgavebenk';
    }, []);

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
        <div>
            {!erProd() && <OpprettDummyBehandling />}
            <OppgaveProvider>
                <OppgavebenkContainer />
            </OppgaveProvider>
        </div>
    );
};

export default Oppgavebenk;
