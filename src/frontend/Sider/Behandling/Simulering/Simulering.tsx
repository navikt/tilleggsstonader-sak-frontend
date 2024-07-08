import React from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import SimuleringResultatWrapper from './SimuleringResultatWrapper';
import { harVedtaksresultatMedTilkjentYtelse } from './simuleringUtils';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { typeVedtakTilTekst } from '../../../typer/vedtak';

const Container = styled.div`
    margin: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: fit-content;
`;

const Simulering: React.FC = () => {
    const { vedtak } = useVedtak();

    return (
        <Container>
            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => (
                    <>
                        {harVedtaksresultatMedTilkjentYtelse(vedtak.type) ? (
                            <SimuleringResultatWrapper />
                        ) : (
                            <Alert variant={'info'} inline>
                                Ingen simulering for vedtaksresultat{' '}
                                {typeVedtakTilTekst[vedtak.type].toLowerCase()}
                            </Alert>
                        )}
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default Simulering;
