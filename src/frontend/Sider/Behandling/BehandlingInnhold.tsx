import React from 'react';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Fanemeny from './Fanemeny/Fanemeny';
import { behandlingFaner } from './Fanemeny/faner';
import Høyremeny from './Høyremeny/Høyremeny';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { VilkårProvider } from '../../context/VilkårContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import { Behandling } from '../../typer/behandling/behandling';

const BehandlingContainer = styled.div`
    display: flex;
`;

const InnholdWrapper = styled.div`
    padding: 1rem;

    flex-grow: 1;

    max-width: calc(100% - 20rem);
`;

const HøyreMenyWrapper = styled.div`
    width: 20rem;
    min-width: 20rem;

    // Når skjermen blir for liten  så blir høyremenyn liggendes ovenfor venstredelen
    z-index: 10;
`;

const BehandlingInnhold: React.FC<{
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
}> = ({ behandling, hentBehandling }) => {
    const paths = useLocation().pathname.split('/').slice(-1);

    const path = paths.length ? paths[paths.length - 1] : '';

    return (
        <BehandlingProvider behandling={behandling} hentBehandling={hentBehandling}>
            <BehandlingContainer>
                <VilkårProvider behandling={behandling}>
                    <InnholdWrapper>
                        <Fanemeny behandlingId={behandling.id} aktivFane={path} />
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
                </VilkårProvider>
                <HøyreMenyWrapper>
                    <Høyremeny />
                </HøyreMenyWrapper>
            </BehandlingContainer>
        </BehandlingProvider>
    );
};

export default BehandlingInnhold;
