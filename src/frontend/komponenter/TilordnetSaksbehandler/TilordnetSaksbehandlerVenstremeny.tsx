import React from 'react';

import styled from 'styled-components';

import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { utledVisningsnavn } from './tilordnetSaksbehandlerUtils';
import { useBehandling } from '../../context/BehandlingContext';
import { BehandlingType } from '../../typer/behandling/behandlingType';
import { SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

const TilordnetSaksbehandlerContainer = styled.div<{ erRevurdering: boolean }>`
    padding: 0.5rem 1rem 0rem 1rem;
    background-color: ${({ erRevurdering }) => (erRevurdering ? AGray50 : 'white')};
`;

const TilordnetSaksbehandlerVenstremeny: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return;
    }

    return (
        <>
            {behandling.tilordnetSaksbehandler?.rolle !==
                SaksbehandlerRolle.OPPGAVE_FINNES_IKKE && (
                <TilordnetSaksbehandlerContainer
                    erRevurdering={behandling.type === BehandlingType.REVURDERING}
                >
                    <HStack gap={'2'} align={'center'}>
                        <div>
                            <BodyShort weight={'semibold'} size={'small'}>
                                Ansvarlig saksbehandler:
                            </BodyShort>
                            <BodyShort size={'small'}>
                                {utledVisningsnavn(behandling.tilordnetSaksbehandler)}
                            </BodyShort>
                        </div>
                    </HStack>
                </TilordnetSaksbehandlerContainer>
            )}
            <div>
                {behandling.tilordnetSaksbehandler?.rolle ===
                    SaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER && (
                    <Alert variant={'warning'} style={{ padding: '1rem' }}>
                        Behandlingens tilhørende oppgave er enten feilregistrert eller satt på et
                        annet tema.
                    </Alert>
                )}
            </div>
        </>
    );
};

export default TilordnetSaksbehandlerVenstremeny;
