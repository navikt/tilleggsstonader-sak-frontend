import React from 'react';

import styled from 'styled-components';

import SimuleringResultatWrapper from './SimuleringResultatWrapper';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: fit-content;
    align-items: flex-start;
`;

const Simulering: React.FC = () => {
    const { vedtak } = useVedtak();

    return (
        <Container>
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => <SimuleringResultatWrapper vedtak={vedtak} />}
            </DataViewer>
        </Container>
    );
};
export default Simulering;
