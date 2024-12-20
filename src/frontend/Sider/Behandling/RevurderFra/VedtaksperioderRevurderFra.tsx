import React from 'react';

import { VedtakshistorikkTilsynBarn } from './TilsynBarn/VedtakshistorikkTilsynBarn';
import { useBehandling } from '../../../context/BehandlingContext';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export const VedtaksperioderRevurderFra = () => {
    const { behandling } = useBehandling();

    if (!behandling.forrigeBehandlingId) {
        return null;
    }
    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <VedtakshistorikkTilsynBarn forrigeBehandlingId={behandling.forrigeBehandlingId} />
            );
        case Stønadstype.LÆREMIDLER:
            return null;
        default:
            return null;
    }
};
