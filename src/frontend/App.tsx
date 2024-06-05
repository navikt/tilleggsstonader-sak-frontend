import React, { useEffect, useState } from 'react';

import {
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Route,
    RouterProvider,
} from 'react-router-dom';

import { LeaveIcon } from '@navikt/aksel-icons';
import { Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import Endringslogg from '@navikt/familie-endringslogg';

import { AppProvider, useApp } from './context/AppContext';
import UlagredeKomponenterModal from './komponenter/Modal/UlagredeKomponenterModal';
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

    const router = createBrowserRouter(
        createRoutesFromElements(
            autentisert ? (
                <Route
                    path={'/'}
                    element={<AppInnhold innloggetSaksbehandler={innloggetSaksbehandler} />}
                >
                    <Route path={''} element={<Oppgavebenk />} />
                    <Route path={'/person/:fagsakPersonId/*'} element={<Personoversikt />} />
                    <Route path={'/journalfor'} element={<Journalføring />} />
                    <Route path={'/behandling/:behandlingId/*'} element={<BehandlingContainer />} />
                    <Route path={'/klagebehandling/*'} element={<KlageApp />} />
                </Route>
            ) : (
                <Route
                    path={'*'}
                    element={<div>Sesjonen har utløpt. Prøv å last inn siden på nytt.</div>}
                />
            )
        )
    );
    return <RouterProvider router={router} />;
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
                    <Endringslogg
                        userId={innloggetSaksbehandler.navIdent}
                        dataFetchingIntervalSeconds={60 * 15}
                        appId={'TS'}
                        backendUrl={'/endringslogg'}
                        dataset={'production'}
                        maxEntries={50}
                        appName={'Tilleggsstønader'}
                        alignLeft={true}
                        stil={'lys'}
                    />
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
            <ScrollToTop />
            <Outlet />
            <Toast />
            <UlagredeKomponenterModal />
        </>
    );
};

export default App;
