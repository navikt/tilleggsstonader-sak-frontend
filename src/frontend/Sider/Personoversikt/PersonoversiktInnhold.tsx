import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@navikt/ds-react';

import Aktivitetsoversikt from './Aktivitetsoversikt/Aktivitetsoversikt';
import { VedtaksoversiktArena } from './Behandlingsoversikt/Arena/VedtaksoversiktArena';
import Behandlingsoversikt from './Behandlingsoversikt/BehandlingOversikt';
import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import FrittståendeBrevFane from './FrittståendeBrev/FrittståendeBrevFane';
import Oppgaveoversikt from './Oppgaveoversikt/Oppgaveoversikt';
import { VedtaksperioderOversikt } from './Vedtaksperioderoversikt/VedtaksperioderOversikt';
import Ytelseoversikt from './Ytelseoversikt/Ytelseoversikt';
import { Toggle } from '../../utils/toggles';

type TabWithRouter = {
    label: string;
    path: string;
    komponent: (fagsakPersonId: string) => React.ReactNode | undefined;
};

const tabs: TabWithRouter[] = [
    {
        label: 'Oppgaver',
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
        label: 'TS-Arena',
        path: 'arena',
        komponent: (fagsakPersonId) => <VedtaksoversiktArena fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Vedtaksperioder',
        path: 'vedtaksperioder',
        komponent: (fagsakPersonId) => <VedtaksperioderOversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Andre ytelser',
        path: 'ytelser',
        komponent: (fagsakPersonId) => <Ytelseoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Dokumentoversikt',
        path: 'dokumentoversikt',
        komponent: (fagsakPersonId) => <Dokumentoversikt fagsakPersonId={fagsakPersonId} />,
    },
    {
        label: 'Brev',
        path: 'brev',
        komponent: (fagsakPersonId) => <FrittståendeBrevFane fagsakPersonId={fagsakPersonId} />,
    },
];

const InnholdWrapper = styled.div`
    padding: 2rem 2rem 64px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const PersonoversiktInnhold: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const navigate = useNavigate();

    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';

    const visVedtaksperiodeOversikt = useFlag(Toggle.SKAL_VISE_VEDTAKSPERIODER_TAB);
    const tabsSomSkalVises = tabs.filter((tab) => {
        if (tab.path === 'vedtaksperioder' && !visVedtaksperiodeOversikt) {
            return false;
        }
        return !(tab.path === 'arena' && visVedtaksperiodeOversikt);
    });

    return (
        <>
            <Tabs
                value={path}
                onChange={(tabPath) => {
                    navigate(`/person/${fagsakPersonId}/${tabPath}`);
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
                        element={
                            <Navigate
                                to={`/person/${fagsakPersonId}/${tabs[0].path}`}
                                replace={true}
                            />
                        }
                    />
                </Routes>
            </InnholdWrapper>
        </>
    );
};

export default PersonoversiktInnhold;
