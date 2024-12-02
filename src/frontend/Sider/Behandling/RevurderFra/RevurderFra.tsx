import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { Alert, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import DateInputMedLeservisning from '../../../komponenter/Skjema/DateInputMedLeservisning';
import { Behandling } from '../../../typer/behandling/behandling';
import { RessursStatus } from '../../../typer/ressurs';
import { erEtter, formaterNullableTilTekstligDato } from '../../../utils/dato';
import { FanePath } from '../faner';
import { Vedtakshistorikk } from './Vedtakshistorikk';
import { Toggle } from '../../../utils/toggles';

const Container = styled.div`
    margin: 2rem;
`;

export function RevurderFra() {
    const { behandlingErRedigerbar, behandling, hentBehandling } = useBehandling();
    const { request } = useApp();
    const navigate = useNavigate();

    const [valideringsfeil, settValideringsfeil] = useState<string | undefined>();
    const [feilVedLagring, settFeilVedLagring] = useState<string>();
    const [revurderFraDato, settRevurderFraDato] = useState<string | undefined>(
        behandling.revurderFra
    );
    const [visAdvarselOmNullstilling, settVisAdvarselOmNullstilling] = useState<boolean>(false);

    const viseVedtakshistorikk = useFlag(Toggle.VISE_VEDTAKSHISTORIKK);

    function håndterEndretDato(nyDato?: string) {
        settRevurderFraDato(nyDato);

        if (nyDato && behandling.revurderFra) {
            settVisAdvarselOmNullstilling(erEtter(nyDato, behandling.revurderFra));
        } else {
            settVisAdvarselOmNullstilling(false);
        }
    }

    async function lagreRevurderFraDato() {
        if (!revurderFraDato) {
            settValideringsfeil('Du må velge en dato');
            return;
        }

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
            <VStack gap="16">
                <VStack gap="2">
                    <DateInputMedLeservisning
                        label="Revurderes fra"
                        value={revurderFraDato}
                        onChange={håndterEndretDato}
                        erLesevisning={!behandlingErRedigerbar}
                        feil={valideringsfeil}
                        size="small"
                    />
                    {visAdvarselOmNullstilling && (
                        <Alert variant="warning" size="small" style={{ maxWidth: 'fit-content' }}>
                            Du ønsker nå å revurdere fra en senere tid enn det som tidligere er
                            valgt ({formaterNullableTilTekstligDato(behandling.revurderFra)}). Hvis
                            du lagrer denne datoen, blir alle endringene i revurderingen nullstilt.
                        </Alert>
                    )}
                    {behandlingErRedigerbar && (
                        <SmallButton onClick={lagreRevurderFraDato}>Lagre og gå videre</SmallButton>
                    )}
                    {feilVedLagring && <Feilmelding>{feilVedLagring}</Feilmelding>}
                </VStack>
                {viseVedtakshistorikk && <Vedtakshistorikk />}
            </VStack>
        </Container>
    );
}
