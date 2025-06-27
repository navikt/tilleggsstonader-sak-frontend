import React from 'react';

import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import { AGray50, AWhite } from '@navikt/ds-tokens/dist/tokens';

import { utledVisningsnavn } from './tilordnetSaksbehandlerUtils';
import { useBehandling } from '../../context/BehandlingContext';
import { BehandlingType } from '../../typer/behandling/behandlingType';
import { SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

const TilordnetSaksbehandlerVenstremeny: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return;
    }

    return (
        <>
            {behandling.tilordnetSaksbehandler?.rolle !==
                SaksbehandlerRolle.OPPGAVE_FINNES_IKKE && (
                <HStack
                    gap={'2'}
                    align={'center'}
                    paddingInline={'space-16 space-0'}
                    paddingBlock={'space-8 space-0'}
                    style={{
                        backgroundColor:
                            behandling.type === BehandlingType.REVURDERING ? AGray50 : AWhite,
                    }}
                >
                    <div>
                        <BodyShort weight={'semibold'} size={'small'}>
                            Ansvarlig saksbehandler:
                        </BodyShort>
                        <BodyShort size={'small'}>
                            {utledVisningsnavn(behandling.tilordnetSaksbehandler)}
                        </BodyShort>
                    </div>
                </HStack>
            )}
            {behandling.tilordnetSaksbehandler?.rolle ===
                SaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_TILLEGGSSTONADER && (
                <Alert variant={'warning'} style={{ padding: '1rem' }}>
                    Behandlingens tilhørende oppgave er enten feilregistrert eller satt på et annet
                    tema.
                </Alert>
            )}
        </>
    );
};

export default TilordnetSaksbehandlerVenstremeny;
