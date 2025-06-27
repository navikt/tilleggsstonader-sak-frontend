import React from 'react';

import styled from 'styled-components';

import { PersonHeadsetIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import { StatusBar, utledStatusbarFarge } from './StatusBar';
import { utledVisningsnavn } from './tilordnetSaksbehandlerUtils';
import { useBehandling } from '../../context/BehandlingContext';

export const PersonIkon = styled(PersonHeadsetIcon)`
    width: 3rem;
    height: 3rem;
`;

const TilordnetSaksbehandler: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return;
    }

    return (
        <>
            <HStack gap={'2'} align={'center'}>
                <PersonIkon />
                <div>
                    <BodyShort weight={'semibold'} size={'small'}>
                        Ansvarlig saksbehandler:
                    </BodyShort>
                    <BodyShort size={'small'}>
                        {utledVisningsnavn(behandling.tilordnetSaksbehandler)}
                    </BodyShort>
                </div>
            </HStack>
            <StatusBar $color={utledStatusbarFarge(behandling.tilordnetSaksbehandler.rolle)} />
        </>
    );
};

export default TilordnetSaksbehandler;
