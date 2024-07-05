import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppProvider, useApp } from './App/context/AppContext';
import ErrorBoundary from './Felles/ErrorBoundary/ErrorBoundary';
import { Route, Routes } from 'react-router-dom';
import BehandlingContainer from './Komponenter/Behandling/BehandlingContainer';
import { Toast } from './Felles/Toast/Toast';
import { ModalWrapper } from './Felles/Modal/ModalWrapper';
import styled from 'styled-components';

import { BodyLong } from '@navikt/ds-react';

import { hentInnloggetBruker } from './App/api/saksbehandler';
import { ISaksbehandler } from './App/typer/saksbehandler';
import UlagretDataModal from './Felles/Modal/UlagretDataModal';
import { AppEnv, hentEnv } from '../../utils/env';

const Innhold = styled(BodyLong)`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

export const App: React.FC = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<ISaksbehandler>();
    const [appEnv, settAppEnv] = useState<AppEnv>();

    React.useEffect(() => {
        hentEnv(settAppEnv)
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler: ISaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    if (!innloggetSaksbehandler || !appEnv) {
        return null;
    }
    return (
        <ErrorBoundary innloggetSaksbehandler={innloggetSaksbehandler}>
            <AppProvider autentisertSaksbehandler={innloggetSaksbehandler} appEnv={appEnv}>
                <AppRoutes innloggetSaksbehandler={innloggetSaksbehandler} />
            </AppProvider>
        </ErrorBoundary>
    );
};

const AppRoutes: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({ innloggetSaksbehandler }) => {
    const { autentisert } = useApp();

    return !autentisert ? (
        <ModalWrapper
            tittel={'Ugyldig sesjon'}
            visModal={true}
            ariaLabel={'Sesjonen har utløpt. Prøv å last inn siden på nytt.'}
        >
            <Innhold>Prøv å laste siden på nytt</Innhold>
        </ModalWrapper>
    ) : (
        <AppInnhold innloggetSaksbehandler={innloggetSaksbehandler} />
    );
};


const AppInnhold: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = () => {
    const navigate = useNavigate();
    const { valgtSide, byttUrl, settByttUrl } = useApp();

    useEffect(() => {
        if (valgtSide && byttUrl) {
            settByttUrl(false);
            navigate(valgtSide);
        }
        //     eslint-disable-next-line
    }, [byttUrl, valgtSide]);

    return (
        <>
            <Routes>
                <Route path="/:behandlingId/*" element={<BehandlingContainer />} />
            </Routes>
            <UlagretDataModal />
            <Toast />
        </>
    );
};
