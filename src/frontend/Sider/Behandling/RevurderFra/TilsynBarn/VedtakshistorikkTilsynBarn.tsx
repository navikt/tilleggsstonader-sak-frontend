import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import { useHentFullstendigOversikt } from './useHentFullstendigOversikt';
import VedtakshistorikkTilsynBarnTabellVisning from './VedtakshistorikkTilsynBarnTabellVisning';
import DataViewer from '../../../../komponenter/DataViewer';

const StyledVStack = styled(VStack)`
    max-width: 40rem;
`;

export const VedtakshistorikkTilsynBarn = (behandlingId: string) => {
    const { hentFullstendigOversikt, fullstendigOversikt } = useHentFullstendigOversikt();

    useEffect(() => {
        hentFullstendigOversikt(behandlingId);
    }, [behandlingId, hentFullstendigOversikt]);

    return (
        <StyledVStack gap="4">
            <Heading size="xsmall">Vedtakshistorikk tilsyn barn TS-Sak </Heading>
            <DataViewer response={{ fullstendigOversikt }}>
                {({ fullstendigOversikt }) => (
                    <VedtakshistorikkTilsynBarnTabellVisning data={fullstendigOversikt} />
                )}
            </DataViewer>
        </StyledVStack>
    );
};
