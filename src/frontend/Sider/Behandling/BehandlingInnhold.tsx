import React from 'react';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Fanemeny from './Fanemeny/Fanemeny';
import { behandlingFaner } from './Fanemeny/faner';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import { Behandling } from '../../typer/behandling/behandling';

const InnholdWrapper = styled.div`
    padding: 1rem;
`;

const BehandlingInnhold: React.FC<{
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
}> = ({ behandling, hentBehandling }) => {
    const paths = useLocation().pathname.split('/').slice(-1);

    const path = paths.length ? paths[paths.length - 1] : '';

    return (
        <BehandlingProvider behandling={behandling} hentBehandling={hentBehandling}>
            <Fanemeny behandlingId={behandling.id} aktivFane={path} />
            <InnholdWrapper>
                <Routes>
                    {behandlingFaner.map((tab) => (
                        <Route
                            key={tab.path}
                            path={`/${tab.path}`}
                            element={tab.komponent(behandling.id)}
                        />
                    ))}
                    <Route
                        path="*"
                        element={<Navigate to={behandlingFaner[0].path} replace={true} />}
                    />
                </Routes>
            </InnholdWrapper>
        </BehandlingProvider>
    );
};

export default BehandlingInnhold;
