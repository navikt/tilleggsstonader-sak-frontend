import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { Alert, VStack } from '@navikt/ds-react';

import { VedtaksperioderRevurderFra } from './VedtaksperioderRevurderFra';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { Feil, feiletRessursTilFeilmelding } from '../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import DateInputMedLeservisning from '../../../komponenter/Skjema/DateInputMedLeservisning';
import { Behandling } from '../../../typer/behandling/behandling';
import { RessursStatus } from '../../../typer/ressurs';
import { erEtter, formaterNullableTilTekstligDato } from '../../../utils/dato';
import { FanePath } from '../faner';

const Container = styled.div`
    margin: 2rem;
`;

export function RevurderFra() {
    const { behandlingErRedigerbar, behandling, hentBehandling } = useBehandling();
    const { request } = useApp();
    const navigate = useNavigate();

    const [valideringsfeil, settValideringsfeil] = useState<string | undefined>();
    const [feilVedLagring, settFeilVedLagring] = useState<Feil>();
    const [revurderFraDato, settRevurderFraDato] = useState<string | undefined>(
        behandling.revurderFra
    );
    const [visAdvarselOmNullstilling, settVisAdvarselOmNullstilling] = useState<boolean>(false);

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
            settFeilVedLagring(feiletRessursTilFeilmelding(response));
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
                    <Feilmelding feil={feilVedLagring} />
                </VStack>
                <VedtaksperioderRevurderFra />
            </VStack>
        </Container>
    );
}
