import React, { useState } from 'react';

import { Alert, Button, VStack } from '@navikt/ds-react';

import styles from './UtenBrev.module.css';
import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { erFeil, Feil, lagFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import { useSendTilBeslutter } from '../Brev/useSendTilBeslutter';
import { VedtakFerdigstiltModal } from '../Brev/VedtakFerdigstiltModal';

export const UtenBrev: React.FC = () => {
    const { erStegRedigerbart } = useSteg();
    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const { sendTilBeslutter, visVedtakFerdigstiltModal, lukkVedtakFerdigstiltModal } =
        useSendTilBeslutter();

    const onClick = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        sendTilBeslutter()
            .then(() => settFeilmelding(undefined))
            .catch((error) =>
                erFeil(error)
                    ? settFeilmelding(error)
                    : settFeilmelding(lagFeilmelding('Ukjent feil oppstod'))
            )
            .finally(() => settLaster(false));
    };

    return (
        <VStack gap="space-24" align="start">
            <Alert variant={'info'} inline>
                Årsak til behandling er uten brev
            </Alert>
            {erStegRedigerbart && (
                <Button className={styles.knapp} size="small" onClick={onClick} disabled={laster}>
                    Send til beslutter
                </Button>
            )}
            <Feilmelding feil={feilmelding} />
            <VedtakFerdigstiltModal
                visModal={visVedtakFerdigstiltModal}
                lukkModal={lukkVedtakFerdigstiltModal}
            />
        </VStack>
    );
};
