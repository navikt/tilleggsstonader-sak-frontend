import React, { useEffect, useState } from 'react';

import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { LeaveIcon } from '@navikt/aksel-icons';
import { Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';

import { AppProvider, useApp } from './context/AppContext';
import PersonSøk from './komponenter/PersonSøk';
import ScrollToTop from './komponenter/ScrollToTop/ScrollToTop';
import Toast from './komponenter/Toast';
import { Sticky } from './komponenter/Visningskomponenter/Sticky';
import BehandlingContainer from './Sider/Behandling/BehandlingContainer';
import { Journalføring } from './Sider/Journalføring/Standard/Journalføring';
import { App as KlageApp } from './Sider/Klage/App';
import Oppgavebenk from './Sider/Oppgavebenk/Oppgavebenk';
import Personoversikt from './Sider/Personoversikt/Personoversikt';
import { AppEnv, hentEnv } from './utils/env';
import { hentInnloggetSaksbehandler, Saksbehandler } from './utils/saksbehandler';

const AppRoutes: React.FC<{ innloggetSaksbehandler: Saksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const { autentisert } = useApp();

    return (
        <BrowserRouter>
            <ScrollToTop />
            {autentisert ? (
                <Routes>
                    <Route
                        path={'/'}
                        element={<AppInnhold innloggetSaksbehandler={innloggetSaksbehandler} />}
                    >
                        <Route path={''} element={<Oppgavebenk />} />
                        <Route path={'/person/:fagsakPersonId/*'} element={<Personoversikt />} />
                        <Route path={'/journalfor'} element={<Journalføring />} />
                        <Route
                            path={'/behandling/:behandlingId/*'}
                            element={<BehandlingContainer />}
                        />
                        <Route path={'/klagebehandling/*'} element={<KlageApp />} />
                    </Route>
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
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<Saksbehandler>();
    const [appEnv, settAppEnv] = useState<AppEnv>();
    useEffect(() => hentInnloggetSaksbehandler(settInnloggetSaksbehandler), []);
    useEffect(() => hentEnv(settAppEnv), []);

    if (!innloggetSaksbehandler || !appEnv) {
        return null;
    }
    return (
        <AppProvider saksbehandler={innloggetSaksbehandler} appEnv={appEnv}>
            <AppRoutes innloggetSaksbehandler={innloggetSaksbehandler} />
        </AppProvider>
    );
};

const AppInnhold: React.FC<{ innloggetSaksbehandler: Saksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const { loggUt } = useApp();
    return (
        <>
            <Sticky $zIndex={100}>
                <InternalHeader>
                    <InternalHeader.Title href="/">Tilleggsstønader</InternalHeader.Title>
                    <Spacer />
                    <PersonSøk />
                    <Dropdown>
                        <InternalHeader.UserButton
                            as={Dropdown.Toggle}
                            name={innloggetSaksbehandler.name}
                        />
                        <Dropdown.Menu>
                            <Dropdown.Menu.List>
                                <Dropdown.Menu.List.Item onClick={loggUt}>
                                    Logg ut <Spacer /> <LeaveIcon aria-hidden fontSize="1.5rem" />
                                </Dropdown.Menu.List.Item>
                            </Dropdown.Menu.List>
                        </Dropdown.Menu>
                    </Dropdown>
                </InternalHeader>
            </Sticky>
            <Outlet />
            <Toast />
        </>
    );
};

export default App;
