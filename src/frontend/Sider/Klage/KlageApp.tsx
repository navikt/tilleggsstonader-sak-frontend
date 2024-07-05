import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { KlageAppProvider, useApp } from './App/context/KlageAppContext';
import { Route, Routes } from 'react-router-dom';
import BehandlingContainer from './Komponenter/Behandling/BehandlingContainer';
import { Toast } from './Felles/Toast/Toast';
import styled from 'styled-components';

import { BodyLong } from '@navikt/ds-react';

import UlagretDataModal from './Felles/Modal/UlagretDataModal';
import { ModalWrapper } from '../../komponenter/Modal/ModalWrapper';

const Innhold = styled(BodyLong)`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

export const KlageApp: React.FC = () => {
    return (
        <KlageAppProvider>
            <AppInnhold />
        </KlageAppProvider>
    );
};

const AppInnhold: React.FC = () => {
    const navigate = useNavigate();
    const { valgtSide, byttUrl, settByttUrl } = useApp();

    useEffect(() => {
        if (valgtSide && byttUrl) {
            settByttUrl(false);
            navigate(valgtSide);
        }
        //     eslint-disable-next-line
    }, [byttUrl, valgtSide]);

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
        <>
            <Routes>
                <Route path="/:behandlingId/*" element={<BehandlingContainer />} />
            </Routes>
            <UlagretDataModal />
            <Toast />
        </>
    );
};
