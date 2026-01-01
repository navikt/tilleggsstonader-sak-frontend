import React from 'react';

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Tabs } from '@navikt/ds-react';

import Aktivitetsoversikt from './Aktivitetsoversikt/Aktivitetsoversikt';
import Behandlingsoversikt from './Behandlingsoversikt/BehandlingOversikt';
import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import FrittståendeBrevFane from './FrittståendeBrev/FrittståendeBrevFane';
import Oppgaveoversikt from './Oppgaveoversikt/Oppgaveoversikt';
import styles from './PersonoversiktInnhold.module.css';
import { VedtaksperioderOversikt } from './Vedtaksperioderoversikt/VedtaksperioderOversikt';
import Ytelseoversikt from './Ytelseoversikt/Ytelseoversikt';

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

const PersonoversiktInnhold: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const navigate = useNavigate();

    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';

    return (
        <>
            <Tabs
                value={path}
                onChange={(tabPath) => {
                    navigate(`/person/${fagsakPersonId}/${tabPath}`);
                }}
            >
                <Tabs.List>
                    {tabs.map((tab) => {
                        return <Tabs.Tab key={tab.path} value={tab.path} label={tab.label} />;
                    })}
                </Tabs.List>
            </Tabs>
            <div className={styles.innholdWrapper}>
                <Routes>
                    {tabs.map((tab) => (
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
            </div>
        </>
    );
};

export default PersonoversiktInnhold;
