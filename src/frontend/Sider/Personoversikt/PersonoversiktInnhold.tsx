import React from 'react';

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Tabs } from '@navikt/ds-react';

import Behandlingsoversikt from './Behandlingsoversikt/BehandlingOversikt';

type TabWithRouter = {
    label: string;
    path: string;
    komponent: (fagsakPersonId: string) => React.ReactNode | undefined;
};

const tabs: TabWithRouter[] = [
    {
        label: 'Behandlingsoversikt',
        path: 'behandlinger',
        komponent: (fagsakPersonId) => <Behandlingsoversikt fagsakPersonId={fagsakPersonId} />,
    },
];

const PersonoversiktInnhold: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const navigate = useNavigate();

    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';

    return (
        <>
            <Tabs
                value={path}
                onChange={(tabPath) => {
                    navigate(tabPath);
                }}
            >
                <Tabs.List>
                    {tabs.map((tab) => {
                        return <Tabs.Tab key={tab.path} value={tab.path} label={tab.label} />;
                    })}
                </Tabs.List>
            </Tabs>
            <Routes>
                {tabs.map((tab) => (
                    <Route
                        key={tab.path}
                        path={`/${tab.path}`}
                        element={tab.komponent(fagsakPersonId)}
                    />
                ))}
                <Route path="*" element={<Navigate to="behandlinger" replace={true} />} />
            </Routes>
        </>
    );
};

export default PersonoversiktInnhold;
