import React from 'react';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Fanemeny from './Fanemeny/Fanemeny';
import { behandlingFaner } from './Fanemeny/faner';

const InnholdWrapper = styled.div`
    padding: 1rem;
`;

const BehandlingInnhold: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';

    return (
        <>
            <Fanemeny behandlingId={behandlingId} aktivFane={path} />
            <InnholdWrapper>
                <Routes>
                    {behandlingFaner.map((tab) => (
                        <Route
                            key={tab.path}
                            path={`/${tab.path}`}
                            element={tab.komponent(behandlingId)}
                        />
                    ))}
                    <Route
                        path="*"
                        element={<Navigate to={behandlingFaner[0].path} replace={true} />}
                    />
                </Routes>
            </InnholdWrapper>
        </>
    );
};

export default BehandlingInnhold;
