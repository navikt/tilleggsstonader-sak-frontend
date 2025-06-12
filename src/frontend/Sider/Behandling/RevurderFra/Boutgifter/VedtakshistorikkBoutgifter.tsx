import React, { FC } from 'react';

import styled from 'styled-components';

import { Heading, VStack } from '@navikt/ds-react';

import { useHentFullstendigOversikt } from './useHentFullstendigOversikt';
import DataViewer from '../../../../komponenter/DataViewer';
import { VedtaksperioderOversiktBoutgifter } from '../../../Personoversikt/Vedtaksperioderoversikt/Boutgifter/VedtaksperioderOversiktBoutgifter';

const StyledVStack = styled(VStack)`
    max-width: 50rem;
`;

type Props = {
    forrigeIverksatteBehandlingId: string;
};
export const VedtakshistorikkBoutgifter: FC<Props> = ({ forrigeIverksatteBehandlingId }) => {
    const { detaljerteVedtaksperioderBoutgifter } = useHentFullstendigOversikt(
        forrigeIverksatteBehandlingId
    );
    return (
        <StyledVStack gap="4">
            <Heading size="xsmall">Vedtakshistorikk boutgifter TS-Sak </Heading>
            <DataViewer
                type={'vedtaksperioder'}
                response={{
                    detaljerteVedtaksperioderBoutgifter: detaljerteVedtaksperioderBoutgifter,
                }}
            >
                {({ detaljerteVedtaksperioderBoutgifter }) => (
                    <VedtaksperioderOversiktBoutgifter
                        vedtaksperioder={detaljerteVedtaksperioderBoutgifter}
                    />
                )}
            </DataViewer>
        </StyledVStack>
    );
};
