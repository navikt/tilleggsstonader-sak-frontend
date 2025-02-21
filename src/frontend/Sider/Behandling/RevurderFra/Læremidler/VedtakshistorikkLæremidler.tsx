import React, { FC } from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import { useHentFullstendigOversikt } from './useHentFullstendigOversikt';
import VedtakshistorikkLæremidlerTabellVisning from './VedtakshistorikkLæremidlerTabellVisning';
import DataViewer from '../../../../komponenter/DataViewer';

const StyledVStack = styled(VStack)`
    max-width: 40rem;
`;
type Props = {
    forrigeBehandlingId: string;
};
export const VedtakshistorikkLæremidler: FC<Props> = ({ forrigeBehandlingId }) => {
    const { vedtakLæremidler } = useHentFullstendigOversikt(forrigeBehandlingId);
    return (
        <StyledVStack gap="4">
            <Heading size="xsmall">Vedtakshistorikk læremidler TS-Sak </Heading>
            <DataViewer response={{ vedtakLæremidler }}>
                {({ vedtakLæremidler }) => (
                    <VedtakshistorikkLæremidlerTabellVisning vedtakLæremidler={vedtakLæremidler} />
                )}
            </DataViewer>
        </StyledVStack>
    );
};
