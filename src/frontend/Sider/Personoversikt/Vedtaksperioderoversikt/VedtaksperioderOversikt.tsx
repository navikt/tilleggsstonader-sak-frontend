import React from 'react';

import { Detail, Heading, VStack } from '@navikt/ds-react';

import { ArenaSakOgVedtak } from './Arena/vedtakArena';
import { VedtaksperioderOversiktBoutgifter } from './Boutgifter/VedtaksperioderOversiktBoutgifter';
import { IngenVedtaksperioderInfo } from './IngenVedtaksperioderInfo';
import { OversiktKort } from './OversiktKort';
import { VedtaksperioderOversiktArena } from './VedtaksperioderOversiktArena';
import { VedtaksperioderOversiktLæremidler } from './VedtaksperioderOversiktLæremidler';
import { VedtaksperioderOversiktTilsynBarn } from './VedtaksperioderOversiktTilsynBarn';
import {
    useHentFullstendigVedtaksOversikt,
    useVedtaksperioderOversiktArena,
} from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { VedtakperioderOversiktResponse } from '../../../typer/vedtak/vedtaksperiodeOppsummering';
import { formaterDatoMedTidspunkt } from '../../../utils/dato';

interface Props {
    fagsakPersonId: string;
}

export function VedtaksperioderOversikt({ fagsakPersonId }: Props) {
    const { vedtaksperioderOversikt, hentetTidspunkt } =
        useHentFullstendigVedtaksOversikt(fagsakPersonId);
    const { arenaSakOgVedtak, hentetTidspunkt: hentetTidspunktArena } =
        useVedtaksperioderOversiktArena(fagsakPersonId);

    return (
        <>
            <Heading size="small" spacing>
                Vedtaksperioder i TS-sak
            </Heading>
            <DataViewer
                type={'vedtaksperioder'}
                response={{ vedtaksperioderOversikt, arenaSakOgVedtak }}
            >
                {({ vedtaksperioderOversikt, arenaSakOgVedtak }) =>
                    finnesIngenVedtaksperioder(vedtaksperioderOversikt, arenaSakOgVedtak) ? (
                        <IngenVedtaksperioderInfo hentetTidspunkt={hentetTidspunkt} />
                    ) : (
                        <VStack gap={'8'}>
                            {vedtaksperioderOversikt.tilsynBarn.length > 0 && (
                                <OversiktKort tittel={'Tilsyn Barn'}>
                                    <VedtaksperioderOversiktTilsynBarn
                                        vedtaksperioder={vedtaksperioderOversikt.tilsynBarn}
                                    />
                                    <Detail>
                                        Oppdatert: {formaterDatoMedTidspunkt(hentetTidspunkt)}
                                    </Detail>
                                </OversiktKort>
                            )}
                            {vedtaksperioderOversikt.læremidler.length > 0 && (
                                <OversiktKort tittel={'Læremidler'}>
                                    <VedtaksperioderOversiktLæremidler
                                        vedtaksperioder={vedtaksperioderOversikt.læremidler}
                                    />
                                    <Detail>
                                        Oppdatert: {formaterDatoMedTidspunkt(hentetTidspunkt)}
                                    </Detail>
                                </OversiktKort>
                            )}
                            {vedtaksperioderOversikt.boutgifter.length > 0 && (
                                <OversiktKort tittel={'Boutgifter'}>
                                    <VedtaksperioderOversiktBoutgifter
                                        vedtaksperioder={vedtaksperioderOversikt.boutgifter}
                                    />
                                    <Detail>
                                        Oppdatert: {formaterDatoMedTidspunkt(hentetTidspunkt)}
                                    </Detail>
                                </OversiktKort>
                            )}
                            {arenaSakOgVedtak.vedtak.length > 0 && (
                                <OversiktKort
                                    tittel={'TS vedtak i Arena'}
                                    tagTittel={'Arena'}
                                    tagVariant={'info'}
                                >
                                    <VedtaksperioderOversiktArena
                                        arenaSakOgVedtak={arenaSakOgVedtak}
                                    />
                                    <Detail>
                                        Oppdatert: {formaterDatoMedTidspunkt(hentetTidspunktArena)}
                                    </Detail>
                                </OversiktKort>
                            )}
                        </VStack>
                    )
                }
            </DataViewer>
        </>
    );
}

const finnesIngenVedtaksperioder = (
    vedtaksperioderOversikt: VedtakperioderOversiktResponse,
    arenaSakOgVedtak: ArenaSakOgVedtak
): boolean =>
    vedtaksperioderOversikt.boutgifter.length === 0 &&
    vedtaksperioderOversikt.læremidler.length === 0 &&
    vedtaksperioderOversikt.tilsynBarn.length === 0 &&
    arenaSakOgVedtak.vedtak.length === 0;
