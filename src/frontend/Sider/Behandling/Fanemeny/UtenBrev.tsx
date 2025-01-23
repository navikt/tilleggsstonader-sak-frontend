import React, { useState } from 'react';

import styled from 'styled-components';

import { Alert, Button, VStack } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { useSendTilBeslutter } from '../Brev/useSendTilBeslutter';
import { VedtakFerdigstiltModal } from '../Brev/VedtakFerdigstiltModal';

const Container = styled(VStack)`
    margin: 2rem;
`;

const Knapp = styled(Button)`
    display: block;
`;

export const UtenBrev: React.FC = () => {
    const { erStegRedigerbart } = useSteg();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const { sendTilBeslutter, visVedtakFerdigstiltModal, lukkVedtakFerdigstiltModal } =
        useSendTilBeslutter();

    const onClick = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        sendTilBeslutter()
            .then(() => settFeilmelding(undefined))
            .finally(() => settLaster(false));
    };

    return (
        <Container gap="2" align="start">
            <Alert variant={'warning'}>Årsak til behandling er uten brev</Alert>
            {erStegRedigerbart && (
                <Knapp onClick={onClick} disabled={laster}>
                    Send til beslutter
                </Knapp>
            )}
            <Feilmelding>{feilmelding}</Feilmelding>
            <VedtakFerdigstiltModal
                visModal={visVedtakFerdigstiltModal}
                lukkModal={lukkVedtakFerdigstiltModal}
            />
        </Container>
    );
};
