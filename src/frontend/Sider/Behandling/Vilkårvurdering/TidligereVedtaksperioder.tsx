import React from 'react';

import { TidligereVedtaksperioderHosTS } from './TidligereVedtaksperioderTS';
import { useHentFullstendigVedtaksOversiktForStønad } from '../../../hooks/useHentFullstendigVedtaksOversikt';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingFakta } from '../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
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

    return (
        <>
            {arenaVedtakTom && !forrigeIverksatteBehandlingId ? (
                <VarselVedtakIArena arenaVedtakTom={arenaVedtakTom} />
            ) : (
                <DataViewer
                    type={'vedtaksperioder'}
                    response={{ vedtaksperioderOversiktForStønad }}
                >
                    {({ vedtaksperioderOversiktForStønad }) => (
                        <TidligereVedtaksperioderHosTS
                            vedtaksperioderOversiktForStønad={vedtaksperioderOversiktForStønad}
                            stønadstype={stønadstype}
                            arenaVedtakTom={arenaVedtakTom}
                        />
                    )}
                </DataViewer>
            )}
        </>
    );
}
