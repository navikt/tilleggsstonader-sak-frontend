import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { InternalHeader, Spacer } from '@navikt/ds-react';

import { AppProvider } from './context/AppContext';
import { Sticky } from './komponenter/Visningskomponenter/Sticky';
import BehandlingContainer from './Sider/Behandling/BehandlingContainer';
import Oppgavebenk from './Sider/Oppgavebenk/Oppgavebenk';
import Personoversikt from './Sider/Personoversikt/Personoversikt';

const App: React.FC = () => {
    return (
        <AppProvider>
            <Sticky>
                <InternalHeader>
                    <InternalHeader.Title as="h1">Tilleggsstønader</InternalHeader.Title>
                    <Spacer />
                    <InternalHeader.User name="Ola Normann" />
                </InternalHeader>
            </Sticky>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Oppgavebenk />} />
                    <Route path={'/person/:fagsakPersonId/*'} element={<Personoversikt />} />
                    <Route path={'/behandling/:behandlingId/*'} element={<BehandlingContainer />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
};

export default App;
