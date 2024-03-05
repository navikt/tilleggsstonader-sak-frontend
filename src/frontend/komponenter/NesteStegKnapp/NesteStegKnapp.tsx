import React, { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, HStack } from '@navikt/ds-react';

import { useBehandling } from '../../context/BehandlingContext';
import { FanePath } from '../../Sider/Behandling/faner';

export const NesteStegKnapp: FC<{
    nesteFane: FanePath;
}> = ({ nesteFane }) => {
    const navigate = useNavigate();

    const { behandling } = useBehandling();

    return (
        <HStack>
            <Button
                variant="primary"
                size="small"
                onClick={() => navigate(`/behandling/${behandling.id}/${nesteFane}`)}
            >
                Neste steg
            </Button>
        </HStack>
    );
};
