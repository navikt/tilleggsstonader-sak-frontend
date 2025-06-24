import React from 'react';

import styled from 'styled-components';

import SimuleringResultatWrapper from './SimuleringResultatWrapper';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

const Container = styled.div`
    margin: 0.5rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: fit-content;
    align-items: flex-start;
`;

const Simulering: React.FC = () => {
    const { vedtak } = useVedtak();

    return (
        <Container>
            <VarselVedtakIArena />
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => <SimuleringResultatWrapper vedtak={vedtak} />}
            </DataViewer>
        </Container>
    );
};

export default Simulering;
