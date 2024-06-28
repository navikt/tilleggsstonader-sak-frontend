import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppProvider, useApp } from './App/context/AppContext';
import ErrorBoundary from './Felles/ErrorBoundary/ErrorBoundary';
// import { TogglesProvider } from './App/context/TogglesContext';
import { Route, Routes } from 'react-router-dom';
import BehandlingContainer from './Komponenter/Behandling/BehandlingContainer';
import { AppEnv, hentEnv } from './App/api/env';
import { Toast } from './Felles/Toast/Toast';
import { ModalWrapper } from './Felles/Modal/ModalWrapper';
import styled from 'styled-components';

import { BodyLong } from '@navikt/ds-react';

import { hentInnloggetBruker } from './App/api/saksbehandler';
import { ISaksbehandler } from './App/typer/saksbehandler';
import UlagretDataModal from './Felles/Modal/UlagretDataModal';

const Innhold = styled(BodyLong)`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

export const App: React.FC = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = useState<ISaksbehandler>();
    const [appEnv, settAppEnv] = useState<AppEnv>();

    React.useEffect(() => {
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler: ISaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    React.useEffect(() => {
        hentEnv().then((env: AppEnv) => {
            settAppEnv(env);
        });
    }, []);

    if (!innloggetSaksbehandler || !appEnv) {
        return null;
    }
    return (
        <ErrorBoundary innloggetSaksbehandler={innloggetSaksbehandler}>
            <AppProvider autentisertSaksbehandler={innloggetSaksbehandler} appEnv={appEnv}>
                {/*         <TogglesProvider>*/}
                <AppRoutes innloggetSaksbehandler={innloggetSaksbehandler} />
                {/*</TogglesProvider>*/}
            </AppProvider>
        </ErrorBoundary>
    );
};

export default App;

const AppRoutes: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const { autentisert } = useApp();

    if (!autentisert) {
        return (
            // <BrowserRouter>
            <ModalWrapper
                tittel={'Ugyldig sesjon'}
                visModal={true}
                ariaLabel={'Sesjonen har utløpt. Prøv å last inn siden på nytt.'}
            >
                <Innhold>Prøv å last siden på nytt</Innhold>
            </ModalWrapper>
        );
        // </BrowserRouter>;
    }

    return (
        // <BrowserRouter>
        <AppInnhold innloggetSaksbehandler={innloggetSaksbehandler} />
        // </BrowserRouter>
    );
};

const AppInnhold: React.FC<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
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
