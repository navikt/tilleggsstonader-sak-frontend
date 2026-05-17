import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Button, VStack } from '@navikt/ds-react';

import styles from './FullførKjørelisteFane.module.css';
import { KjørelisteBrevmeny } from './KjørelisteBrevmeny';
import { useFullførKjøreliste } from './useFullførKjøreliste';
import { useKjørelisteBrev } from './useKjørelisteBrev';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { PdfVisning } from '../../../komponenter/PdfVisning';
import { Steg } from '../../../typer/behandling/steg';
import { Toggle } from '../../../utils/toggles';
import { useSendTilBeslutter } from '../Brev/useSendTilBeslutter';
import { VedtakFerdigstiltModal } from '../Brev/VedtakFerdigstiltModal';

export const FullførKjørelisteFane: FC = () => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const totrinnskontrollToggle = useFlag(Toggle.TOTRINNSKONTROLL_FOR_KJØRELISTEBEHANDLING);

    const { brevPdf, settBrevPdf, lagretBegrunnelse } = useKjørelisteBrev();
    const { fullførKjøreliste, laster, feilmelding, settHarUlagredeEndringer } =
        useFullførKjøreliste();
    const { sendTilBeslutter, visVedtakFerdigstiltModal, lukkVedtakFerdigstiltModal } =
        useSendTilBeslutter();

    const erSendTilBeslutterSteg =
        totrinnskontrollToggle && behandling.steg === Steg.SEND_TIL_BESLUTTER;
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
                                {erSendTilBeslutterSteg ? (
                                    <Button
                                        variant="primary"
                                        onClick={() => sendTilBeslutter()}
                                        size={'small'}
                                    >
                                        Send til beslutter
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        loading={laster}
                                        onClick={fullførKjøreliste}
                                        size={'small'}
                                    >
                                        Fullfør kjørelistebehandling
                                    </Button>
                                )}
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
