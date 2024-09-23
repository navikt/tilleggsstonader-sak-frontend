import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import DateInputMedLeservisning from '../../../komponenter/Skjema/DateInputMedLeservisning';
import { Behandling } from '../../../typer/behandling/behandling';
import { RessursStatus } from '../../../typer/ressurs';
import { FanePath } from '../faner';

const Container = styled.div`
    margin: 2rem;
`;

export function RevurderFra() {
    const { behandlingErRedigerbar, behandling, hentBehandling } = useBehandling();
    const { request } = useApp();
    const navigate = useNavigate();

    const [feilVedLagring, settFeilVedLagring] = useState<string>();

    const [revurderFraDato, settRevurderFraDato] = useState<string | undefined>(
        behandling.revurderFra
    );

    async function endreRevurderFraDato() {
        const response = await request<Behandling, null>(
            `/api/sak/behandling/${behandling.id}/revurder-fra/${revurderFraDato}`,
            'POST'
        );
        if (response.status === RessursStatus.SUKSESS) {
            settFeilVedLagring(undefined);
            hentBehandling.rerun();
            navigate(`/behandling/${behandling.id}/${FanePath.INNGANGSVILKÅR}`);
        } else {
            settFeilVedLagring(response.frontendFeilmelding);
        }
    }

    return (
        <Container>
            <VStack gap="2">
                <DateInputMedLeservisning
                    label="Revurderes fra"
                    value={revurderFraDato}
                    onChange={settRevurderFraDato}
                    erLesevisning={!behandlingErRedigerbar}
                    size="small"
                />
                <SmallButton onClick={endreRevurderFraDato}>Lagre og gå videre</SmallButton>
                {feilVedLagring && <Feilmelding>{feilVedLagring}</Feilmelding>}
            </VStack>
        </Container>
    );
}
