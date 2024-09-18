import React from 'react';

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@navikt/ds-react';

import Aktivitetsoversikt from './Aktivitetsoversikt/Aktivitetsoversikt';
import Behandlingsoversikt from './Behandlingsoversikt/BehandlingOversikt';
import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import FrittståendeBrevFane from './FrittståendeBrev/FrittståendeBrevFane';
import Oppgaveoversikt from './Oppgaveoversikt/Oppgaveoversikt';
import Ytelseoversikt from './Ytelseoversikt/Ytelseoversikt';

type TabWithRouter = {
    label: string;
    path: string;
    komponent: (fagsakPersonId: string) => React.ReactNode | undefined;
};

const tabs: TabWithRouter[] = [
    {
        label: 'Åpne oppgaver',
        path: 'oppgaver',
        komponent: (fagsakPersonId: string) => <Oppgaveoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Saker',
        path: 'behandlinger',
        komponent: (fagsakPersonId) => <Behandlingsoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Aktiviteter',
        path: 'aktiviteter',
        komponent: (fagsakPersonId) => <Aktivitetsoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Ytelser',
        path: 'ytelser',
        komponent: (fagsakPersonId) => <Ytelseoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Dokumentoversikt',
        path: 'dokumentoversikt',
        komponent: (fagsakPersonId) => <Dokumentoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Frittstående brev',
        path: 'brev',
        komponent: (fagsakPersonId) => <FrittståendeBrevFane fagsakPersonId={fagsakPersonId} />,
    },
];

const InnholdWrapper = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

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
            <InnholdWrapper>
                <Routes>
                    {tabs.map((tab) => (
                        <Route
                            key={tab.path}
                            path={`/${tab.path}`}
                            element={tab.komponent(fagsakPersonId)}
                        />
                    ))}
                    <Route path="*" element={<Navigate to={tabs[0].path} replace={true} />} />
                </Routes>
            </InnholdWrapper>
        </>
    );
};

export default PersonoversiktInnhold;
