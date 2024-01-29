import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import { useApp } from '../context/AppContext';
import { Toast as ToastEnum, toastTilTekst } from '../typer/toast';

const ContainerTopRight = styled.div`
    z-index: 9999;
    position: fixed;
    right: 2rem;
    top: 4rem;
`;

const Toast: React.FC = () => {
    const { toast, settToast } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            settToast(undefined);
        }, 5000);
        return () => clearTimeout(timer);
    });

    switch (toast) {
        case null:
        case undefined:
            return null;

        case ToastEnum.DISABLED_FANE:
            return (
                <ContainerTopRight>
                    <Alert variant="warning">{toastTilTekst[toast]}</Alert>
                </ContainerTopRight>
            );

        default:
            return (
                <ContainerTopRight>
                    <Alert variant="success">{toastTilTekst[toast]}</Alert>
                </ContainerTopRight>
            );
    }
};

export default Toast;
