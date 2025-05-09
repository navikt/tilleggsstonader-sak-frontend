import React from 'react';

import { VStack } from '@navikt/ds-react';

import { VedtaksperioderOversiktTilsynBarn } from './VedtaksperioderOversiktTilsynBarn';
import { useHentFullstendigVedtaksOversikt } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';

interface Props {
    fagsakPersonId: string;
}

export function VedtaksperioderOversikt({ fagsakPersonId }: Props) {
    const { vedtaksperioderOversikt } = useHentFullstendigVedtaksOversikt(fagsakPersonId);
    if (vedtaksperioderOversikt.status !== 'SUKSESS') {
        return;
    }

    return (
        <DataViewer response={{ vedtaksperioderOversikt }}>
            {({ vedtaksperioderOversikt }) => (
                <VStack gap={'8'}>
                    <VedtaksperioderOversiktTilsynBarn
                        vedtaksperioder={vedtaksperioderOversikt.tilsynBarn}
                    />
                </VStack>
            )}
        </DataViewer>
    );
}
