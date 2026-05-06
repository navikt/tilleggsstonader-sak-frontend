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
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';

export const FullførKjørelisteFane: FC = () => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const { brevPdf, settBrevPdf, lagretBegrunnelse } = useKjørelisteBrev();
    const { fullførKjøreliste, laster, feilmelding, settHarUlagredeEndringer } =
        useFullførKjøreliste();

    return (
        <div className={styles.toKolonner}>
            <VStack gap="space-16">
                {erStegRedigerbart && lagretBegrunnelse !== undefined && (
                    <KjørelisteBrevmeny
                        lagretBegrunnelse={lagretBegrunnelse}
                        settHarUlagredeEndringer={settHarUlagredeEndringer}
                        settBrevPdf={settBrevPdf}
                    />
                )}

                {behandling.status === BehandlingStatus.FERDIGSTILT && (
                    <span>Kjørelister er sendt til utbetaling</span>
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
    );
};
