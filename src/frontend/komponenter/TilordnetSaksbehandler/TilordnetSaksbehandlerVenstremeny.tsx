import React from 'react';

import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

import { utledVisningsnavn } from './tilordnetSaksbehandlerUtils';
import { useBehandling } from '../../context/BehandlingContext';
import { TilordnetSaksbehandlerPåOppgave } from '../../typer/behandling/tilordnetSaksbehandlerDto';

export const TilordnetSaksbehandlerVenstremeny: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return (
            <Alert
                size={'small'}
                variant={'info'}
                inline={true}
                style={{ backgroundColor: AGray50 }}
            >
                Klarte ikke å hente ansvarlig saksbehandler
            </Alert>
        );
    }
    if (
        behandling.tilordnetSaksbehandler?.tilordnetSaksbehandlerPåOppgave !==
        TilordnetSaksbehandlerPåOppgave.OPPGAVE_FINNES_IKKE
    ) {
        return (
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
        );
    }

    return null;
};
