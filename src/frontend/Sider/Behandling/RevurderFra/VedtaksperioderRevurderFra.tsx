import React from 'react';

import { VedtakshistorikkBoutgifter } from './Boutgifter/VedtakshistorikkBoutgifter';
import { VedtakshistorikkLæremidler } from './Læremidler/VedtakshistorikkLæremidler';
import { VedtakshistorikkTilsynBarn } from './TilsynBarn/VedtakshistorikkTilsynBarn';
import { useBehandling } from '../../../context/BehandlingContext';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export const VedtaksperioderRevurderFra = () => {
    const { behandling } = useBehandling();

    if (!behandling.forrigeIverksatteBehandlingId) {
        return null;
    }
    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return (
                <VedtakshistorikkTilsynBarn
                    forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
                />
            );
        case Stønadstype.LÆREMIDLER:
            return (
                <VedtakshistorikkLæremidler
                    forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
                />
            );
        case Stønadstype.BOUTGIFTER:
            return (
                <VedtakshistorikkBoutgifter
                    forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
                />
            );
        default:
            return null;
    }
};
