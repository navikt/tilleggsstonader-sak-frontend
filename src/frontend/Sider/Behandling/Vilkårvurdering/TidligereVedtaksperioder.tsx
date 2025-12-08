import React from 'react';

import { TidligereVedtaksperioderTS } from './TidligereVedtaksperioderTS';
import { BehandlingFakta } from '../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

type Props = {
    behandlingFakta: BehandlingFakta;
    forrigeIverksatteBehandlingId: string | undefined;
    stønadstype: Stønadstype;
    sluttdatoForrigeVedtak: string | undefined;
};

export function TidligereVedtaksperioder({
    behandlingFakta,
    forrigeIverksatteBehandlingId,
    stønadstype,
    sluttdatoForrigeVedtak,
}: Props) {
    const sluttdatoPåVedtakIArena = behandlingFakta.arena?.vedtakTom;

    return forrigeIverksatteBehandlingId ? (
        <TidligereVedtaksperioderTS
            stønadstype={stønadstype}
            sluttdatoPåVedtakIArena={sluttdatoPåVedtakIArena}
            sluttdatoForrigeVedtak={sluttdatoForrigeVedtak}
            forrigeIverksatteBehandlingId={forrigeIverksatteBehandlingId}
        />
    ) : (
        sluttdatoPåVedtakIArena && <VarselVedtakIArena arenaVedtakTom={sluttdatoPåVedtakIArena} />
    );
}
