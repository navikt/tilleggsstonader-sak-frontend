import React, { useState } from 'react';

import styled from 'styled-components';

import { Alert, Button, VStack } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { erFeil, Feil, lagFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import { useSendTilBeslutter } from '../Brev/useSendTilBeslutter';
import { VedtakFerdigstiltModal } from '../Brev/VedtakFerdigstiltModal';
import { KommentarTilBeslutter } from '../Totrinnskontroll/KommentarTilBeslutter';

const Container = styled(VStack)`
    margin: 2rem;
`;

const Knapp = styled(Button)`
    display: block;
`;

export const UtenBrev: React.FC = () => {
    const { erStegRedigerbart } = useSteg();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();
    const [kommentarTilBeslutter, settKommentarTilBeslutter] = useState<string>();

    const { sendTilBeslutter, visVedtakFerdigstiltModal, lukkVedtakFerdigstiltModal } =
        useSendTilBeslutter();

    const onClick = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        sendTilBeslutter(kommentarTilBeslutter)
            .then(() => settFeilmelding(undefined))
            .catch((error) =>
                erFeil(error)
                    ? settFeilmelding(error)
                    : settFeilmelding(lagFeilmelding('Ukjent feil oppstod'))
            )
            .finally(() => settLaster(false));
    };

    return (
        <Container gap="2" align="start">
            <Alert variant={'warning'}>Årsak til behandling er uten brev</Alert>
            <KommentarTilBeslutter
                kommentarTilBeslutter={kommentarTilBeslutter}
                settKommentarTilBeslutter={settKommentarTilBeslutter}
            />
            {erStegRedigerbart && (
                <Knapp onClick={onClick} disabled={laster}>
                    Send til beslutter
                </Knapp>
            )}
            <Feilmelding feil={feilmelding} />
            <VedtakFerdigstiltModal
                visModal={visVedtakFerdigstiltModal}
                lukkModal={lukkVedtakFerdigstiltModal}
            />
        </Container>
    );
};
