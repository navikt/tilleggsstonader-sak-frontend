import React from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import VedtakshistorikkTabellVisning from './VedtakshistorikkTabellVisning';

const InnholdWrapper = styled.div`
    max-width: 40rem;
`;

export const Vedtakshistorikk = () => {
    return (
        <InnholdWrapper>
            <VStack gap="4">
                <Heading size="xsmall">Vedtakshistorikk tilsyn barn TS-Sak </Heading>
                <VedtakshistorikkTabellVisning />
            </VStack>
        </InnholdWrapper>
    );
};
