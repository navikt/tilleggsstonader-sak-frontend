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
    const sluttdatoPåVedtakIArena = behandlingFakta.arena?.vedtakTom;

    return forrigeIverksatteBehandlingId ? (
        <TidligereVedtaksperioderTS
            stønadstype={stønadstype}
            sluttdatoPåVedtakIArena={sluttdatoPåVedtakIArena}
            forrigeIverksatteBehandlingId={forrigeIverksatteBehandlingId}
        />
    ) : (
        sluttdatoPåVedtakIArena && <VarselVedtakIArena arenaVedtakTom={sluttdatoPåVedtakIArena} />
    );
}
