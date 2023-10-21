import React, { useEffect, useState } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { InternalHeader, Spacer } from '@navikt/ds-react';

import { AppProvider, useApp } from './context/AppContext';
import { Sticky } from './komponenter/Visningskomponenter/Sticky';
import BehandlingContainer from './Sider/Behandling/BehandlingContainer';
import Oppgavebenk from './Sider/Oppgavebenk/Oppgavebenk';
import Personoversikt from './Sider/Personoversikt/Personoversikt';
import { AppEnv } from './utils/env';
import { hentInnloggetSaksbehandler, Saksbehandler } from './utils/saksbehandler';

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
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<Saksbehandler>();
    useEffect(() => {
        hentInnloggetSaksbehandler(settInnloggetSaksbehandler);
    }, []);
    if (!innloggetSaksbehandler) {
        return null;
    }

    const appEnv: AppEnv = {
        roller: {
            veileder: '',
            saksbehandler: '',
            beslutter: '',
            kode6: '',
            kode7: '',
            egenAnsatt: '',
        },
    };
    return (
        <AppProvider saksbehandler={innloggetSaksbehandler} appEnv={appEnv}>
            <Sticky>
                <InternalHeader>
                    <InternalHeader.Title as="h1">Tilleggsstønader</InternalHeader.Title>
                    <Spacer />
                    <InternalHeader.User name={innloggetSaksbehandler.name} />
                </InternalHeader>
            </Sticky>
            <AppRoutes />
        </AppProvider>
    );
};

export default App;
