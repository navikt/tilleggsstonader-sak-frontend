import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { InternalHeader, Spacer } from '@navikt/ds-react';

import { AppProvider, useApp } from './context/AppContext';
import { Sticky } from './komponenter/Visningskomponenter/Sticky';
import BehandlingContainer from './Sider/Behandling/BehandlingContainer';
import Oppgavebenk from './Sider/Oppgavebenk/Oppgavebenk';
import Personoversikt from './Sider/Personoversikt/Personoversikt';

const AppRoutes = () => {
    const { autentisert } = useApp();
    return (
        <BrowserRouter>
            {autentisert ? (
                <Routes>
                    <Route path={'/'} element={<Oppgavebenk />} />
                    <Route path={'/person/:fagsakPersonId/*'} element={<Personoversikt />} />
                    <Route path={'/behandling/:behandlingId/*'} element={<BehandlingContainer />} />
                </Routes>
            ) : (
                <Routes>
                    <Route
                        path={'*'}
                        element={<div>Sesjonen har utløpt. Prøv å last inn siden på nytt.</div>}
                    />
                </Routes>
            )}
        </BrowserRouter>
    );
};

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
            <AppRoutes />
        </AppProvider>
    );
};

export default App;
