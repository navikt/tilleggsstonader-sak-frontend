import React from 'react';

import styled from 'styled-components';

import { BodyShort, HStack } from '@navikt/ds-react';

import Info from '../../../komponenter/Ikoner/Vurderingsresultat/Info';
import { formaterDatoMedTidspunkt } from '../../../utils/dato';

const StyledInfo = styled(Info)`
    width: 1.125rem;
    height: 1.125rem;
`;

export const IngenVedtaksperioderInfo = ({
    hentetTidspunkt,
}: {
    hentetTidspunkt: Date | undefined;
}) => {
    return (
        <HStack gap={'2'} align={'center'}>
            <StyledInfo />
            <BodyShort>
                Ingen vedtaksperioder funnet. Oppdatert: {formaterDatoMedTidspunkt(hentetTidspunkt)}
            </BodyShort>
        </HStack>
    );
};
