import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { EksternOmrutingBehandling } from './EksternOmrutingBehandling';
import { EksternOmrutingSaksoversikt } from './EksternOmrutingSaksoversikt';

export function EksternOmruting() {
    return (
        <Routes>
            <Route path={'/person/:eksternFagsakId'} element={<EksternOmrutingSaksoversikt />} />
            <Route
                path={'/behandling/:eksternBehandlingId'}
                element={<EksternOmrutingBehandling />}
            />
        </Routes>
    );
}
