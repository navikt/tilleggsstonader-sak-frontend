import React from 'react';

import styled from 'styled-components';

import { Alert, VStack } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';
import SendTilBeslutterKnapp from '../Totrinnskontroll/SendTilBeslutterKnapp';

const Container = styled(VStack)`
    margin: 2rem;
`;

export const KorrigeringFane: React.FC = () => {
    const { erStegRedigerbart } = useSteg();

    return (
        <Container gap="2" align="start">
            <Alert variant={'warning'}>Korrigering av vedtak uten brevutsendelse</Alert>
            {erStegRedigerbart && <SendTilBeslutterKnapp />}
        </Container>
    );
};
