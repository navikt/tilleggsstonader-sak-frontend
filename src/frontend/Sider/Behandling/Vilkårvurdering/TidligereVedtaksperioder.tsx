import React from 'react';

import { ExpansionCard, Heading } from '@navikt/ds-react';
import { ALimegreen50 } from '@navikt/ds-tokens/dist/tokens';

import { useHentFullstendigVedtaksOversiktForStønad } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingFakta } from '../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { formaterDato } from '../../../utils/dato';
import { DetaljerteVedtaksperioderBehandling } from '../DetaljerteVedtaksperioderBehandling';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

type Props = {
    behandlingFakta: BehandlingFakta;
    forrigeIverksatteBehandlingId: string | undefined;
    stønadstype: Stønadstype;
};

export function TidligereVedtaksperioder({
    behandlingFakta,
    forrigeIverksatteBehandlingId,
    stønadstype,
}: Props) {
    const { vedtaksperioderOversiktForStønad } = useHentFullstendigVedtaksOversiktForStønad(
        forrigeIverksatteBehandlingId
    );
    const arenaVedtakTom = behandlingFakta.arena?.vedtakTom;

    if (!arenaVedtakTom && !forrigeIverksatteBehandlingId) {
        return null;
    }

    if (arenaVedtakTom && !forrigeIverksatteBehandlingId) {
        return <VarselVedtakIArena arenaVedtakTom={arenaVedtakTom} />;
    }

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
