import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { InternalHeader, Spacer } from '@navikt/ds-react';

import Personoversikt from './Sider/Personoversikt/Personoversikt';

const App: React.FC = () => {
    return (
        <>
            <InternalHeader>
                <InternalHeader.Title as="h1">Tilleggsstønader</InternalHeader.Title>
                <Spacer />
                <InternalHeader.User name="Ola Normann" />
            </InternalHeader>
            <BrowserRouter>
                <Routes>
                    <Route path={'/person/:fagsakPersonId/*'} element={<Personoversikt />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
