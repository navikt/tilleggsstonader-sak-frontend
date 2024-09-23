import React, { useState } from 'react';

import { styled } from 'styled-components';

import { useBehandling } from '../../../context/BehandlingContext';
import DateInputMedLeservisning from '../../../komponenter/Skjema/DateInputMedLeservisning';

const Container = styled.div`
    margin: 2rem;
`;

export function RevurderFra() {
    const { behandlingErRedigerbar } = useBehandling();

    const [revurderFraDato, settRevurderFraDato] = useState<string>();

    return (
        <Container>
            <DateInputMedLeservisning
                label="Revurderes fra"
                value={revurderFraDato}
                onChange={settRevurderFraDato}
                erLesevisning={!behandlingErRedigerbar}
                size="small"
            />
        </Container>
    );
}
