import React from 'react';

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@navikt/ds-react';

import Aktivitetsoversikt from './Aktivitetsoversikt/Aktivitetsoversikt';
import Behandlingsoversikt from './Behandlingsoversikt/BehandlingOversikt';
import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import FrittståendeBrevFane from './FrittståendeBrev/FrittståendeBrevFane';
import Ytelseoversikt from './Ytelseoversikt/Ytelseoversikt';
import Oppgaveoversikt from './Oppgaveoversikt/Oppgaveoversikt';
import { useFlag } from '@unleash/proxy-client-react';
import { Toggle } from '../../utils/toggles';

type TabWithRouter = {
    label: string;
    path: string;
    komponent: (fagsakPersonId: string) => React.ReactNode | undefined;
};

const tabs: TabWithRouter[] = [
    {
        label: 'Behandlinger',
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
        label: 'Dokumenter',
        path: 'dokumentoversikt',
        komponent: (fagsakPersonId) => <Dokumentoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Brev',
        path: 'brev',
        komponent: (fagsakPersonId) => <FrittståendeBrevFane fagsakPersonId={fagsakPersonId} />,
    },
];

const oppgaveTab = {
    label: 'Oppgaver',
    path: 'oppgaver',
    komponent: (fagsakPersonId: string) => <Oppgaveoversikt fagsakPersonId={fagsakPersonId} />,
};

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

    const skalViseOppgaveTab = useFlag(Toggle.SKAL_VISE_OPPGAVER_PERSONOVERSIKT);

    const tabsSomSkalVises = [...(skalViseOppgaveTab ? [oppgaveTab] : []), ...tabs];

    return (
        <>
            <Tabs
                value={path}
                onChange={(tabPath) => {
                    navigate(tabPath);
                }}
            >
                <Tabs.List>
                    {tabsSomSkalVises.map((tab) => {
                        return <Tabs.Tab key={tab.path} value={tab.path} label={tab.label} />;
                    })}
                </Tabs.List>
            </Tabs>
            <InnholdWrapper>
                <Routes>
                    {tabsSomSkalVises.map((tab) => (
                        <Route
                            key={tab.path}
                            path={`/${tab.path}`}
                            element={tab.komponent(fagsakPersonId)}
                        />
                    ))}
                    <Route
                        path="*"
                        element={<Navigate to={tabsSomSkalVises[0].path} replace={true} />}
                    />
                </Routes>
            </InnholdWrapper>
        </>
    );
};

export default PersonoversiktInnhold;
