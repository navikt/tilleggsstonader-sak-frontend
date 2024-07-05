import React, { useEffect } from 'react';

import styled from 'styled-components';

import { useKlageApp } from '../../App/context/KlageAppContext';
import { toastTilTekst } from '../../App/typer/toast';
import { Alert } from '@navikt/ds-react';

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
