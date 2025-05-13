import React from 'react';

import { VStack } from '@navikt/ds-react';

import { OversiktKort } from './OversiktKort';
import { VedtaksperioderOversiktBoutgifter } from './VedtaksperioderOversiktBoutgifter';
import { VedtaksperioderOversiktLæremidler } from './VedtaksperioderOversiktLæremidler';
import { VedtaksperioderOversiktTilsynBarn } from './VedtaksperioderOversiktTilsynBarn';
import { useHentFullstendigVedtaksOversikt } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { VedtaksoversiktArena } from '../Behandlingsoversikt/Arena/VedtaksoversiktArena';

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
                    <VedtaksperioderOversiktLæremidler
                        vedtaksperioder={vedtaksperioderOversikt.læremidler}
                    />
                    <VedtaksperioderOversiktBoutgifter
                        vedtaksperioder={vedtaksperioderOversikt.boutgifter}
                    />
                    <OversiktKort
                        tittel={'TS vedtak i Arena'}
                        tagTittel={'Arena'}
                        tagVariant={'info'}
                    >
                        <VedtaksoversiktArena fagsakPersonId={fagsakPersonId} />
                    </OversiktKort>
                </VStack>
            )}
        </DataViewer>
    );
}
