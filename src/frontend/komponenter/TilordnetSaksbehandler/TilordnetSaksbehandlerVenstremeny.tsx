import React from 'react';

import styled from 'styled-components';

import { Alert } from '@navikt/ds-react';

import TilordnetSaksbehandler from './TilordnetSaksbehandler';
import { useBehandling } from '../../context/BehandlingContext';
import { SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

const TilordnetSaksbehandlerContainer = styled.div`
    padding: 0.5rem 1rem 0.5rem 1rem;
`;

const TilordnetSaksbehandlerVenstremeny: React.FC = () => {
    const { behandling } = useBehandling();

    return (
        <>
            {behandling.tilordnetSaksbehandler?.rolle !==
                SaksbehandlerRolle.OPPGAVE_FINNES_IKKE && (
                <TilordnetSaksbehandlerContainer>
                    <TilordnetSaksbehandler />
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
