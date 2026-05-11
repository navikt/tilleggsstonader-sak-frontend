import React, { FC } from 'react';

import { Button, VStack } from '@navikt/ds-react';

import styles from './FullførKjørelisteFane.module.css';
import { KjørelisteBrevmeny } from './KjørelisteBrevmeny';
import { useFullførKjøreliste } from './useFullførKjøreliste';
import { useKjørelisteBrev } from './useKjørelisteBrev';
import { useBehandling } from '../../../context/BehandlingContext';
import { useSteg } from '../../../context/StegContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { PdfVisning } from '../../../komponenter/PdfVisning';

export const FullførKjørelisteFane: FC = () => {
    const { behandlingErRedigerbar } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const { brevPdf, settBrevPdf, lagretBegrunnelse } = useKjørelisteBrev();
    const { fullførKjøreliste, laster, feilmelding, settHarUlagredeEndringer } =
        useFullførKjøreliste();

    return (
        <>
            {behandlingErRedigerbar ? (
                <div className={styles.toKolonner}>
                    <VStack gap="space-16">
                        {erStegRedigerbart && lagretBegrunnelse !== undefined && (
                            <KjørelisteBrevmeny
                                lagretBegrunnelse={lagretBegrunnelse}
                                settHarUlagredeEndringer={settHarUlagredeEndringer}
                                settBrevPdf={settBrevPdf}
                            />
                        )}

                        <Feilmelding feil={feilmelding} />

                        {erStegRedigerbart && (
                            <div>
                                <Button
                                    variant="primary"
                                    loading={laster}
                                    onClick={fullførKjøreliste}
                                    size={'small'}
                                >
                                    Fullfør kjørelistebehandling
                                </Button>
                            </div>
                        )}
                    </VStack>
                    <PdfVisning pdfFilInnhold={brevPdf} />
                </div>
            ) : (
                <PdfVisning pdfFilInnhold={brevPdf} />
            )}
        </>
    );
};
