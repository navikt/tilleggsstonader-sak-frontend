import React from 'react';

import { Box } from '@navikt/ds-react';

import { useHentFullstendigVedtaksOversikt } from '../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../komponenter/DataViewer';
import { VedtaksperioderOversiktBoutgifter } from '../Personoversikt/Vedtaksperioderoversikt/Boutgifter/VedtaksperioderOversiktBoutgifter';

type Props = {
    fagsakPersonId: string;
};

export function DetaljerteVedtaksperioderBehandling({ fagsakPersonId }: Props) {
    const { vedtaksperioderOversikt } = useHentFullstendigVedtaksOversikt(fagsakPersonId);

    return (
        <DataViewer type={'vedtaksperioder'} response={{ vedtaksperioderOversikt }}>
            {({ vedtaksperioderOversikt }) => (
                <Box padding="2">
                    {vedtaksperioderOversikt.boutgifter.length > 0 && (
                        <VedtaksperioderOversiktBoutgifter
                            vedtaksperioder={vedtaksperioderOversikt.boutgifter}
                        />
                    )}
                </Box>
            )}
        </DataViewer>
    );
}
