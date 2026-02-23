import React from 'react';

import { Alert, BodyShort, HStack } from '@navikt/ds-react';

import { utledVisningsnavn } from './tilordnetSaksbehandlerUtils';
import { useBehandling } from '../../context/BehandlingContext';
import { TilordnetSaksbehandlerPåOppgave } from '../../typer/behandling/tilordnetSaksbehandlerDto';

export const TilordnetSaksbehandlerVenstremeny: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return (
            <Alert size={'small'} variant={'warning'} inline={true}>
                Klarte ikke å hente ansvarlig saksbehandler
            </Alert>
        );
    }
    if (
        behandling.tilordnetSaksbehandler?.tilordnetSaksbehandlerPåOppgave !==
        TilordnetSaksbehandlerPåOppgave.OPPGAVE_FINNES_IKKE
    ) {
        return (
            <HStack gap={'space-8'} align={'center'}>
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
