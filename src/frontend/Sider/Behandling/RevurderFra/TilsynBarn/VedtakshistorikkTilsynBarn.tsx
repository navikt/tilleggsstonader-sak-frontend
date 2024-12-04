import React, { FC, useEffect } from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import { useHentFullstendigOversikt } from './useHentFullstendigOversikt';
import VedtakshistorikkTilsynBarnTabellVisning from './VedtakshistorikkTilsynBarnTabellVisning';
import DataViewer from '../../../../komponenter/DataViewer';

const StyledVStack = styled(VStack)`
    max-width: 40rem;
`;

type Props = {
    forrigeBehandlingId: string;
};

export const VedtakshistorikkTilsynBarn: FC<Props> = ({ forrigeBehandlingId }) => {
    const { hentBeregningsresultat, beregningsresultatRessurs } = useHentFullstendigOversikt();

    useEffect(() => {
        hentBeregningsresultat(forrigeBehandlingId);
    }, [forrigeBehandlingId, hentBeregningsresultat]);

    return (
        <StyledVStack gap="4">
            <Heading size="xsmall">Vedtakshistorikk tilsyn barn TS-Sak </Heading>
            <DataViewer response={{ beregningsresultatRessurs }}>
                {({ beregningsresultatRessurs }) => (
                    <VedtakshistorikkTilsynBarnTabellVisning
                        beregningsresultat={beregningsresultatRessurs}
                    />
                )}
            </DataViewer>
        </StyledVStack>
    );
};
