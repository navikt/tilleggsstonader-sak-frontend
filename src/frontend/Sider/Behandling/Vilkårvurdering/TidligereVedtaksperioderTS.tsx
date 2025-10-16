import React from 'react';

import { ExpansionCard, Heading } from '@navikt/ds-react';
import { ALimegreen50 } from '@navikt/ds-tokens/dist/tokens';

import { useHentFullstendigVedtaksOversiktForStønad } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { formaterDato } from '../../../utils/dato';
import { DetaljerteVedtaksperioderBehandling } from '../DetaljerteVedtaksperioderBehandling';

type Props = {
    arenaVedtakTom: string | undefined;
    forrigeIverksatteBehandlingId: string | undefined;
    stønadstype: Stønadstype;
};

export function TidligereVedtaksperioderTS({
    arenaVedtakTom,
    forrigeIverksatteBehandlingId,
    stønadstype,
}: Props) {
    const { vedtaksperioderOversiktForStønad } = useHentFullstendigVedtaksOversiktForStønad(
        forrigeIverksatteBehandlingId
    );

    return (
        <DataViewer type={'vedtaksperioder'} response={{ vedtaksperioderOversiktForStønad }}>
            {({ vedtaksperioderOversiktForStønad }) => {
                return (
                    <>
                        {vedtaksperioderOversiktForStønad.length > 0 && (
                            <ExpansionCard
                                style={{ backgroundColor: ALimegreen50 }}
                                size={'small'}
                                aria-labelledby={'Vedtaksperioder for forrige behandling'}
                            >
                                <ExpansionCard.Header>
                                    <ExpansionCard.Title>
                                        <Heading size={'xsmall'} as="span">
                                            Søker har vedtak i TS-sak til og med{' '}
                                            {formaterDato(
                                                vedtaksperioderOversiktForStønad[
                                                    vedtaksperioderOversiktForStønad.length - 1
                                                ].tom
                                            )}
                                        </Heading>
                                    </ExpansionCard.Title>
                                    {arenaVedtakTom && (
                                        <ExpansionCard.Description>
                                            Det finnes også et vedtak i Arena til og med{' '}
                                            {formaterDato(arenaVedtakTom)}
                                        </ExpansionCard.Description>
                                    )}
                                </ExpansionCard.Header>
                                <ExpansionCard.Content>
                                    <DetaljerteVedtaksperioderBehandling
                                        stønadstype={stønadstype}
                                        vedtaksperioderOversiktForStønad={
                                            vedtaksperioderOversiktForStønad
                                        }
                                    />
                                </ExpansionCard.Content>
                            </ExpansionCard>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
}
