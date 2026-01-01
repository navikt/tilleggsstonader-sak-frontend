import * as React from 'react';
import { useEffect } from 'react';

import { Route, Routes, useNavigate } from 'react-router-dom';

import { BodyLong } from '@navikt/ds-react';

import { KlageAppProvider, useKlageApp } from './context/KlageAppContext';
import styles from './KlageApp.module.css';
import UlagretDataModal from './Komponenter/UlagretDataModal/UlagretDataModal';
import BehandlingContainer from './Layout/BehandlingContainer';
import { useApp } from '../../context/AppContext';
import { ModalWrapper } from '../../komponenter/Modal/ModalWrapper';

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
            umamiId={'ugyldig-sesjon'}
            visModal={true}
            ariaLabel={'Sesjonen har utløpt. Prøv å last inn siden på nytt.'}
        >
            <BodyLong className={styles.innhold}>Prøv å laste siden på nytt</BodyLong>
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
