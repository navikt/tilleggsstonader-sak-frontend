import React, { useEffect, useState } from 'react';

import FlagProvider, { IConfig, useFlag, useFlagsStatus } from '@unleash/proxy-client-react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Route,
    RouterProvider,
} from 'react-router-dom';

import { LeaveIcon } from '@navikt/aksel-icons';
import { Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import { Theme } from '@navikt/ds-react/Theme';
import Endringslogg from '@navikt/familie-endringslogg';

import { AppProvider, useApp } from './context/AppContext';
import UlagredeKomponenterModal from './komponenter/Modal/UlagredeKomponenterModal';
import PersonSøk from './komponenter/PersonSøk';
import ScrollToTop from './komponenter/ScrollToTop/ScrollToTop';
import Toast from './komponenter/Toast';
import { Sticky } from './komponenter/Visningskomponenter/Sticky';
import { OppølgingAdmin } from './Sider/Admin/Oppfølging/OppfølgingAdmin';
import OpprettFørstegangsbehandlingAdmin from './Sider/Admin/OpprettFørstegangsbehandlingAdmin';
import BehandlingContainer from './Sider/Behandling/BehandlingContainer';
import { EksternOmruting } from './Sider/EksternOmruting/EksternOmruting';
import { Journalføring } from './Sider/Journalføring/Standard/Journalføring';
import { KlageApp } from './Sider/Klage/KlageApp';
import Oppgavebenk from './Sider/Oppgavebenk/Oppgavebenk';
import Personoversikt from './Sider/Personoversikt/Personoversikt';
import { AppEnv, hentEnv } from './utils/env';
import { hentInnloggetSaksbehandler, Saksbehandler } from './utils/saksbehandler';
import { Toggle } from './utils/toggles';
import { mockFlags } from './utils/unleashMock';
import '@navikt/ds-css/darkside';

const AppRoutes = () => {
    const { settIkkeAutentisert } = useApp();
    const { flagsError } = useFlagsStatus();

    useEffect(() => {
        if (flagsError?.code === 403) {
            settIkkeAutentisert();
        }
    }, [settIkkeAutentisert, flagsError]);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path={'/'} element={<AppInnhold />}>
                <Route path={''} element={<Oppgavebenk />} />
                <Route path={'/person/:fagsakPersonId/*'} element={<Personoversikt />} />
                <Route path={'/journalfor'} element={<Journalføring />} />
                <Route path={'/behandling/:behandlingId/*'} element={<BehandlingContainer />} />
                <Route path={'/ekstern/*'} element={<EksternOmruting />} />
                <Route path={'/klagebehandling/*'} element={<KlageApp />} />
                <Route
                    path={'/admin/opprett-behandling'}
                    element={<OpprettFørstegangsbehandlingAdmin />}
                />
                <Route path={'/admin/oppfolging'} element={<OppølgingAdmin />} />
            </Route>
        )
    );
    return <RouterProvider router={router} />;
};
const config: IConfig = {
    appName: 'ts-sak-frontend',
    url: `${location.origin}/api/toggle`,
    clientKey: 'settes-i-backend',
    refreshInterval: 120, // How often (in seconds) the client should poll the proxy for updates
};

const App: React.FC = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<Saksbehandler>();
    const [autentisert, settAutentisert] = useState(true);
    const [appEnv, settAppEnv] = useState<AppEnv>();
    useEffect(() => hentInnloggetSaksbehandler(settInnloggetSaksbehandler), []);
    useEffect(() => hentEnv(settAppEnv), []);

    if (!innloggetSaksbehandler || !appEnv) {
        return null;
    }
    if (!autentisert) {
        return <div>Sesjonen har utløpt. Prøv å last inn siden på nytt.</div>;
    }
    return (
        <AppProvider
            saksbehandler={innloggetSaksbehandler}
            appEnv={appEnv}
            autentisert={autentisert}
            settIkkeAutentisert={() => settAutentisert(false)}
        >
            <FlagProvider
                config={{
                    ...config,
                    context: { userId: innloggetSaksbehandler.navIdent },
                    environment: appEnv.unleashEnv,
                    bootstrap: appEnv.unleashEnv !== 'mock' ? undefined : mockFlags,
                }}
                startClient={appEnv.unleashEnv !== 'mock'}
            >
                <Theme theme={'light'}>
                    <AppRoutes />
                </Theme>
            </FlagProvider>
        </AppProvider>
    );
};

const AppInnhold = () => {
    const { saksbehandler } = useApp();
    const adminKanOppretteBehandling = useFlag(Toggle.ADMIN_KAN_OPPRETTE_BEHANDLING);
    const adminKanHenteOppfølging = useFlag(Toggle.ADMIN_OPPFØLGING);
    return (
        <>
            <Sticky $zIndex={100}>
                <InternalHeader>
                    <InternalHeader.Title href="/">Tilleggsstønader</InternalHeader.Title>
                    <Spacer />
                    <Endringslogg
                        userId={saksbehandler.navIdent}
                        dataFetchingIntervalSeconds={60 * 15}
                        appId={'TS'}
                        backendUrl={'/endringslogg'}
                        dataset={'production'}
                        maxEntries={50}
                        appName={'TS-sak'}
                        alignLeft={true}
                        stil={'lys'}
                    />
                    <PersonSøk />
                    <Dropdown>
                        <InternalHeader.UserButton as={Dropdown.Toggle} name={saksbehandler.name} />
                        <Dropdown.Menu>
                            <Dropdown.Menu.List>
                                {adminKanOppretteBehandling && (
                                    <Dropdown.Menu.GroupedList.Item
                                        as="a"
                                        href="/admin/opprett-behandling"
                                    >
                                        [Admin] Opprett førstegangsbehandling
                                    </Dropdown.Menu.GroupedList.Item>
                                )}
                                {adminKanHenteOppfølging && (
                                    <Dropdown.Menu.GroupedList.Item as="a" href="/admin/oppfolging">
                                        [Admin] Oppfølging
                                    </Dropdown.Menu.GroupedList.Item>
                                )}
                                <Dropdown.Menu.Divider />
                                <a href={'/oauth2/logout'}>
                                    <Dropdown.Menu.List.Item>
                                        Logg ut <Spacer />
                                        <LeaveIcon aria-hidden fontSize="1.5rem" />
                                    </Dropdown.Menu.List.Item>
                                </a>
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
