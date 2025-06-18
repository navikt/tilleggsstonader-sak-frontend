import React, { useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';

import { useBehandling } from '../../context/BehandlingContext';
import { Toggle } from '../../utils/toggles';

const TilordnetSaksbehandlerCard: React.FC = () => {
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    const { behandling, hentBehandling } = useBehandling();
    const visTilordnetSaksbehandler = useFlag(Toggle.SKAL_VISE_TILORDNET_SAKSBEHANDLER);

    useEffect(() => {
        if (!behandling.tilordnetSaksbehandler && retryCount < maxRetries) {
            const timeout = setTimeout(() => {
                hentBehandling.rerun();
                setRetryCount((prev) => prev + 1);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [behandling.tilordnetSaksbehandler, hentBehandling, retryCount]);

    return (
        <>
            {visTilordnetSaksbehandler && (
                <VStack>
                    <Heading size="xsmall">Ansvarlig saksbehandler:</Heading>
                    <BodyShort size="small">{behandling.tilordnetSaksbehandler ?? '-'}</BodyShort>
                </VStack>
            )}
        </>
    );
};

export default TilordnetSaksbehandlerCard;
