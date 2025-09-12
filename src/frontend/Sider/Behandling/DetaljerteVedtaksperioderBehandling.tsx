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
                <div style={{ marginLeft: '2rem' }}>
                    {vedtaksperioderOversikt.boutgifter.length > 0 && (
                        <Box
                            width={'920px'}
                            style={{ backgroundColor: 'white', border: 'solid 1px lightgray' }}
                        >
                            <VedtaksperioderOversiktBoutgifter
                                vedtaksperioder={vedtaksperioderOversikt.boutgifter}
                            />
                        </Box>
                    )}
                </div>
            )}
        </DataViewer>
    );
}
