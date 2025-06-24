import React, { FC } from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import { useHentFullstendigOversikt } from './useHentFullstendigOversikt';
import VedtakshistorikkTilsynBarnTabellVisning from './VedtakshistorikkTilsynBarnTabellVisning';
import DataViewer from '../../../../komponenter/DataViewer';

const StyledVStack = styled(VStack)`
    max-width: 40rem;
`;

type Props = {
    forrigeIverksatteBehandlingId: string;
};

export const VedtakshistorikkTilsynBarn: FC<Props> = ({ forrigeIverksatteBehandlingId }) => {
    const { vedtakBarnetilsyn } = useHentFullstendigOversikt(forrigeIverksatteBehandlingId);

    return (
        <StyledVStack gap="4">
            <Heading size="xsmall">Vedtakshistorikk tilsyn barn TS-Sak </Heading>
            <DataViewer type={'vedtaksperioder'} response={{ vedtakBarnetilsyn }}>
                {({ vedtakBarnetilsyn }) => (
                    <VedtakshistorikkTilsynBarnTabellVisning
                        vedtakBarnetilsyn={vedtakBarnetilsyn}
                    />
                )}
            </DataViewer>
        </StyledVStack>
    );
};
