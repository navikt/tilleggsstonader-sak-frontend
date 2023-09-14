import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { InternalHeader, Spacer } from '@navikt/ds-react';

import { Sticky } from './komponenter/Visningskomponenter/Sticky';
import BehandlingContainer from './Sider/Behandling/BehandlingContainer';
import Personoversikt from './Sider/Personoversikt/Personoversikt';

const App: React.FC = () => {
    return (
        <>
            <Sticky>
                <InternalHeader>
                    <InternalHeader.Title as="h1">Tilleggsstønader</InternalHeader.Title>
                    <Spacer />
                    <InternalHeader.User name="Ola Normann" />
                </InternalHeader>
            </Sticky>
            <BrowserRouter>
                <Routes>
                    <Route path={'/person/:fagsakPersonId/*'} element={<Personoversikt />} />
                    <Route path={'/behandling/:behandlingId/*'} element={<BehandlingContainer />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
