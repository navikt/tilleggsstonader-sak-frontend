import React from 'react';

import { TidligereVedtaksperioderTS } from './TidligereVedtaksperioderTS';
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
    const arenaVedtakTom = behandlingFakta.arena?.vedtakTom;

    if (!arenaVedtakTom && !forrigeIverksatteBehandlingId) {
        return null;
    }

    return (
        <>
            {arenaVedtakTom && !forrigeIverksatteBehandlingId ? (
                <VarselVedtakIArena arenaVedtakTom={arenaVedtakTom} />
            ) : (
                <TidligereVedtaksperioderTS
                    stønadstype={stønadstype}
                    arenaVedtakTom={arenaVedtakTom}
                    forrigeIverksatteBehandlingId={forrigeIverksatteBehandlingId}
                />
            )}
        </>
    );
}
