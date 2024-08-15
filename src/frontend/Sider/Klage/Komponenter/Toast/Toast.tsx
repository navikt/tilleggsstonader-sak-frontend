import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import { useKlageApp } from '../../context/KlageAppContext';
import { toastTilTekst } from '../../typer/toast';

const Container = styled.div`
    z-index: 9999;
    position: fixed;
    right: 2rem;
    top: 4rem;
`;

export const Toast: React.FC = () => {
    const { toast, settToast } = useKlageApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            settToast(undefined);
        }, 5000);
        return () => clearTimeout(timer);
    });

    return toast ? (
        <Container>
            <Alert variant={'success'}>{toastTilTekst[toast]}</Alert>
        </Container>
    ) : null;
};
