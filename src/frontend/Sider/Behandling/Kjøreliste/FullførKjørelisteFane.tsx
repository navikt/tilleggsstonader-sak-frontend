import React, { FC, useState } from 'react';

import { Button, VStack } from '@navikt/ds-react';

import styles from './FullførKjørelisteFane.module.css';
import { KjørelisteBrevmeny } from './KjørelisteBrevmeny';
import { useKjørelisteBrev } from './useKjørelisteBrev';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Feil, lagFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import { PdfVisning } from '../../../komponenter/PdfVisning';
import { Steg } from '../../../typer/behandling/steg';
import { useSendTilBeslutter } from '../Brev/useSendTilBeslutter';
import { VedtakFerdigstiltModal } from '../Brev/VedtakFerdigstiltModal';

export const FullførKjørelisteFane: FC = () => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const { brevPdf, settBrevPdf, lagretBegrunnelse } = useKjørelisteBrev();
    const { sendTilBeslutter, visVedtakFerdigstiltModal, lukkVedtakFerdigstiltModal } =
        useSendTilBeslutter();

    const [harUlagredeEndringer, settHarUlagredeEndringerIntern] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<Feil>();

    const settHarUlagredeEndringer = (harEndringer: boolean) => {
        if (!harEndringer) settFeilmelding(undefined);
        settHarUlagredeEndringerIntern(harEndringer);
    };

    const handleSendTilBeslutter = () => {
        if (harUlagredeEndringer) {
            settFeilmelding(
                lagFeilmelding(
                    'Du har endret begrunnelsen uten å lagre. Trykk "Lagre begrunnelse" eller fjern teksten før du sender til beslutter.'
                )
            );
            return;
        }
        sendTilBeslutter();
    };

    const erSendTilBeslutterSteg = behandling.steg === Steg.SEND_TIL_BESLUTTER;
    const erRedigerbarISteg =
        behandlingErRedigerbar && (erStegRedigerbart || erSendTilBeslutterSteg);

    return (
        <>
            {behandlingErRedigerbar ? (
                <div className={styles.toKolonner}>
                    <VStack gap="space-16">
                        {erRedigerbarISteg && lagretBegrunnelse !== undefined && (
                            <KjørelisteBrevmeny
                                lagretBegrunnelse={lagretBegrunnelse}
                                settHarUlagredeEndringer={settHarUlagredeEndringer}
                                settBrevPdf={settBrevPdf}
                            />
                        )}

                        <Feilmelding feil={feilmelding} />

                        {erRedigerbarISteg && (
                            <div>
                                <Button
                                    variant="primary"
                                    onClick={handleSendTilBeslutter}
                                    size={'small'}
                                >
                                    Send til beslutter
                                </Button>
                            </div>
                        )}
                    </VStack>
                    <PdfVisning pdfFilInnhold={brevPdf} />
                </div>
            ) : (
                <PdfVisning pdfFilInnhold={brevPdf} />
            )}
            <VedtakFerdigstiltModal
                visModal={visVedtakFerdigstiltModal}
                lukkModal={lukkVedtakFerdigstiltModal}
            />
        </>
    );
};
