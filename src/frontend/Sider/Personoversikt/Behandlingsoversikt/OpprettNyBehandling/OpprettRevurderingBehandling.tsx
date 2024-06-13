import React, { useState } from 'react';

import { Button, HStack, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Fagsak } from '../../../../typer/fagsak';
import { RessursStatus } from '../../../../typer/ressurs';

interface Props {
    fagsak: Fagsak;
    lukkModal: () => void;
    hentBehandlinger: () => void;
}

interface OpprettBehandlingRequest {
    fagsakId: string;
}

const OpprettRevurderingBehandling: React.FC<Props> = ({ fagsak, lukkModal, hentBehandlinger }) => {
    const { request } = useApp();

    const [feilmelding, settFeilmelding] = useState<string>();

    const opprett = () => {
        request<string, OpprettBehandlingRequest>(`/api/sak/behandling`, 'POST', {
            fagsakId: fagsak.id,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentBehandlinger();
                lukkModal();
            } else {
                settFeilmelding(response.frontendFeilmelding || response.melding);
            }
        });
    };

    return (
        <VStack gap="4">
            <HStack gap="4" justify={'end'}>
                <Button variant="tertiary" onClick={lukkModal} size="small">
                    Avbryt
                </Button>
                <Button variant="primary" onClick={opprett} size="small">
                    Lagre
                </Button>
            </HStack>
            <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
        </VStack>
    );
};

export default OpprettRevurderingBehandling;
