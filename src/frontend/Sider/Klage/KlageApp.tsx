import * as React from 'react';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { BodyLong } from '@navikt/ds-react';

import { KlageAppProvider, useKlageApp } from './context/KlageAppContext';
import UlagretDataModal from './Komponenter/UlagretDataModal/UlagretDataModal';
import BehandlingContainer from './Layout/BehandlingContainer';
import { useApp } from '../../context/AppContext';
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
    const { valgtSide, byttUrl, settByttUrl } = useKlageApp();
    const { autentisert } = useApp();

    useEffect(() => {
        if (valgtSide && byttUrl) {
            settByttUrl(false);
            navigate(valgtSide);
        }
        //     eslint-disable-next-line
    }, [byttUrl, valgtSide]);

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
        </>
    );
};
