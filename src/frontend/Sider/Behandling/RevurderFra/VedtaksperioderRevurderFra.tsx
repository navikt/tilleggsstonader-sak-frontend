import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { VedtakshistorikkTilsynBarn } from './TilsynBarn/VedtakshistorikkTilsynBarn';
import { useBehandling } from '../../../context/BehandlingContext';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { Toggle } from '../../../utils/toggles';

export const VedtaksperioderRevurderFra = () => {
    const { behandling } = useBehandling();
    const viseVedtakshistorikk = useFlag(Toggle.VISE_VEDTAKSHISTORIKK);

    if (!viseVedtakshistorikk) {
        return null;
    }
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
