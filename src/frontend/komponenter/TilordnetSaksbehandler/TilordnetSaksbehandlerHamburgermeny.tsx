import React from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, HGrid, VStack } from '@navikt/ds-react';
import { BorderNeutral } from '@navikt/ds-tokens/darkside-js';

import { TilordnetSaksbehandler } from './TilordnetSaksbehandler';
import { useBehandling } from '../../context/BehandlingContext';
import { behandlingResultatTilTekst } from '../../typer/behandling/behandlingResultat';
import { behandlingStatusTilTekst } from '../../typer/behandling/behandlingStatus';
import { TilordnetSaksbehandlerPåOppgave } from '../../typer/behandling/tilordnetSaksbehandlerDto';
import { formaterIsoDato } from '../../utils/dato';

const Container = styled.div`
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    border: 1px solid ${BorderNeutral};
    border-radius: 0.125rem;
    margin: 1rem 0.5rem;
`;

const TilordnetSaksbehandlerHamburgermeny: React.FC = () => {
    const { behandling } = useBehandling();

    const skalViseAnsvarligSaksbehandler =
        behandling.tilordnetSaksbehandler?.tilordnetSaksbehandlerPåOppgave !==
        TilordnetSaksbehandlerPåOppgave.OPPGAVE_FINNES_IKKE;

    return (
        <Container>
            <VStack gap={'2'}>
                {skalViseAnsvarligSaksbehandler && <TilordnetSaksbehandler />}
                <HGrid gap={'6'} columns={2}>
                    <VStack>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Behandlingsstatus
                        </BodyShort>
                        <BodyShort size={'small'}>
                            {behandlingStatusTilTekst[behandling.status]}
                        </BodyShort>
                    </VStack>
                    <VStack>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Opprettet
                        </BodyShort>
                        <BodyShort size={'small'}>
                            {formaterIsoDato(behandling.opprettet)}
                        </BodyShort>
                    </VStack>
                    <VStack>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Behandlingsresultat
                        </BodyShort>
                        <BodyShort size={'small'}>
                            {behandlingResultatTilTekst[behandling.resultat]}
                        </BodyShort>
                    </VStack>
                    <VStack>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Sist endret
                        </BodyShort>
                        <BodyShort size={'small'}>
                            {formaterIsoDato(behandling.sistEndret)}
                        </BodyShort>
                    </VStack>
                </HGrid>
                {behandling.tilordnetSaksbehandler?.tilordnetSaksbehandlerPåOppgave ===
                    TilordnetSaksbehandlerPåOppgave.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER && (
                    <Alert variant={'warning'}>
                        Behandlingens tilhørende oppgave er enten feilregistrert eller satt på et
                        annet tema.
                    </Alert>
                )}
            </VStack>
        </Container>
    );
};

export default TilordnetSaksbehandlerHamburgermeny;
