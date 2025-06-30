import React from 'react';

import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { utledVisningsnavn } from './tilordnetSaksbehandlerUtils';
import { useBehandling } from '../../context/BehandlingContext';
import { SaksbehandlerRolle } from '../../typer/behandling/saksbehandlerDto';

const TilordnetSaksbehandlerVenstremeny: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return (
            <Alert
                variant={'info'}
                inline={true}
                style={{ padding: '0.5rem', backgroundColor: AGray50 }}
            >
                Klarte ikke å hente ansvarlig saksbehandler
            </Alert>
        );
    }

    return (
        <>
            {behandling.tilordnetSaksbehandler?.rolle !==
                SaksbehandlerRolle.OPPGAVE_FINNES_IKKE && (
                <HStack gap={'2'} align={'center'} paddingBlock={'space-0 space-16'}>
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
