import React from 'react';

import { Alert, VStack } from '@navikt/ds-react';

import { KjørelisteProvider } from '../../../context/KjørelisteContext';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { VedtakDagligReise } from '../../../typer/vedtak/vedtakDagligReise';

export const RegistrerKjørelisteFane: React.FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();

    return (
        <DataViewer response={{ vedtak }} type={'reisedata'}>
            {({ vedtak }) => (
                <KjørelisteProvider vedtak={vedtak}>
                    <FaneInnhold />
                </KjørelisteProvider>
            )}
        </DataViewer>
    );
};

const FaneInnhold: React.FC = () => {
    return (
        <VStack gap="space-24">
            <Alert variant={'info'}>
                Her kommer det en komponent som støtter innfylling av kjøreliste på vegne av bruker
            </Alert>
            <StegKnapp steg={Steg.REGISTRER_KJØRELISTE}>Ferdigstill steg</StegKnapp>
        </VStack>
    );
};
