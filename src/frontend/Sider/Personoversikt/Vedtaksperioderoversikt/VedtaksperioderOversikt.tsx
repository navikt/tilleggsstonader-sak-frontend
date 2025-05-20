import React from 'react';

import { VStack } from '@navikt/ds-react';

import { OversiktKort } from './OversiktKort';
import { VedtaksperioderOversiktArena } from './VedtaksperioderOversiktArena';
import { VedtaksperioderOversiktBoutgifter } from './VedtaksperioderOversiktBoutgifter';
import { VedtaksperioderOversiktLæremidler } from './VedtaksperioderOversiktLæremidler';
import { VedtaksperioderOversiktTilsynBarn } from './VedtaksperioderOversiktTilsynBarn';
import {
    useHentFullstendigVedtaksOversikt,
    useVedtaksperioderOversiktArena,
} from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';

interface Props {
    fagsakPersonId: string;
}

export function VedtaksperioderOversikt({ fagsakPersonId }: Props) {
    const { vedtaksperioderOversikt } = useHentFullstendigVedtaksOversikt(fagsakPersonId);
    const { arenaSakOgVedtak } = useVedtaksperioderOversiktArena(fagsakPersonId);
    if (vedtaksperioderOversikt.status !== 'SUKSESS') {
        return;
    }

    return (
        <DataViewer response={{ vedtaksperioderOversikt, arenaSakOgVedtak }}>
            {({ vedtaksperioderOversikt, arenaSakOgVedtak }) => (
                <VStack gap={'8'}>
                    {vedtaksperioderOversikt.tilsynBarn.length > 0 && (
                        <OversiktKort tittel={'Tilsyn Barn'}>
                            <VedtaksperioderOversiktTilsynBarn
                                vedtaksperioder={vedtaksperioderOversikt.tilsynBarn}
                            />
                        </OversiktKort>
                    )}
                    {vedtaksperioderOversikt.læremidler.length > 0 && (
                        <OversiktKort tittel={'Læremidler'}>
                            <VedtaksperioderOversiktLæremidler
                                vedtaksperioder={vedtaksperioderOversikt.læremidler}
                            />
                        </OversiktKort>
                    )}
                    {vedtaksperioderOversikt.boutgifter.length > 0 && (
                        <OversiktKort tittel={'Boutgifter'}>
                            <VedtaksperioderOversiktBoutgifter
                                vedtaksperioder={vedtaksperioderOversikt.boutgifter}
                            />
                        </OversiktKort>
                    )}
                    {arenaSakOgVedtak.vedtak.length > 0 && (
                        <VedtaksperioderOversiktArena arenaSakOgVedtak={arenaSakOgVedtak} />
                    )}
                </VStack>
            )}
        </DataViewer>
    );
}
