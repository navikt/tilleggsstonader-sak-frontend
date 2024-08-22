import React, { useState } from 'react';

import { Button, HStack, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { BehandlingÅrsak } from '../../../../typer/behandling/behandlingÅrsak';
import { RessursStatus } from '../../../../typer/ressurs';

interface Props {
    fagsakId: string;
    stønadstype: Stønadstype;
    lukkModal: () => void;
    hentBehandlinger: () => void;
}

interface OpprettBehandlingRequest {
    fagsakId: string;
    årsak: BehandlingÅrsak;
}

const OpprettRevurderingBehandling: React.FC<Props> = ({
    fagsakId,
    lukkModal,
    hentBehandlinger,
}) => {
    const { request } = useApp();

    const [feilmelding, settFeilmelding] = useState<string>();

    const opprett = () => {
        request<string, OpprettBehandlingRequest>(`/api/sak/behandling`, 'POST', {
            fagsakId: fagsakId,
            årsak: BehandlingÅrsak.NYE_OPPLYSNINGER,
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
