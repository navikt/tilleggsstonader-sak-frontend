import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import { useApp } from '../context/AppContext';
import { toastTilTekst } from '../typer/toast';

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

    return (
        toast && (
            <ContainerTopRight>
                <Alert variant="success">{toastTilTekst[toast]}</Alert>
            </ContainerTopRight>
        )
    );
};

export default Toast;
