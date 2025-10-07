import React from 'react';

import { ExpansionCard, Heading } from '@navikt/ds-react';
import { ALimegreen50 } from '@navikt/ds-tokens/dist/tokens';

import { useHentFullstendigVedtaksOversiktForStønad } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { Behandling } from '../../../typer/behandling/behandling';
import { BehandlingFakta } from '../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterDato } from '../../../utils/dato';
import { DetaljerteVedtaksperioderBehandling } from '../DetaljerteVedtaksperioderBehandling';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

type Props = {
    behandling: Behandling;
    behandlingFakta: BehandlingFakta;
};

export function TidligereVedtaksperioder({ behandling, behandlingFakta }: Props) {
    const { vedtaksperioderOversiktForStønad } =
        useHentFullstendigVedtaksOversiktForStønad(behandling);
    const arenaVedtakTom = behandlingFakta.arena?.vedtakTom;

    if (!arenaVedtakTom && !behandling.forrigeIverksatteBehandlingId) {
        return null;
    }

    return (
        <DataViewer type={'vedtaksperioder'} response={{ vedtaksperioderOversiktForStønad }}>
            {({ vedtaksperioderOversiktForStønad }) => {
                return (
                    <>
                        {vedtaksperioderOversiktForStønad.length > 0 && (
                            <ExpansionCard
                                defaultOpen={true}
                                style={{ backgroundColor: ALimegreen50 }}
                                size={'small'}
                                aria-labelledby={'Vedtaksperioder for forrige behandling'}
                            >
                                <ExpansionCard.Header>
                                    <ExpansionCard.Title>
                                        <Heading size={'xsmall'}>
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
                                        stønadstype={behandling.stønadstype}
                                        vedtaksperioderOversiktForStønad={
                                            vedtaksperioderOversiktForStønad
                                        }
                                    />
                                </ExpansionCard.Content>
                            </ExpansionCard>
                        )}
                        {arenaVedtakTom && vedtaksperioderOversiktForStønad.length === 0 && (
                            <VarselVedtakIArena arenaVedtakTom={arenaVedtakTom} />
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
}
