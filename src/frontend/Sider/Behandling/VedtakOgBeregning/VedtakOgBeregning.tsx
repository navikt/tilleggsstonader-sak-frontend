import React from 'react';

import VedtakOgBeregningBarnetilsyn from './Barnetilsyn/VedtakOgBeregningBarnetilsyn';
import { VedtakOgBeregningBoutgifter } from './Boutgifter/VedtakOgBeregningBoutgifter';
import VedtakOgBeregningLæremidler from './Læremidler/VedtakOgBeregningLæremidler';
import { useBehandling } from '../../../context/BehandlingContext';
import { Stønadstype, stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';

export const VedtakOgBeregning = () => {
    const { behandling } = useBehandling();
    switch (behandling.stønadstype) {
        case Stønadstype.BARNETILSYN:
            return <VedtakOgBeregningBarnetilsyn />;
        case Stønadstype.LÆREMIDLER:
            return <VedtakOgBeregningLæremidler />;
        case Stønadstype.BOUTGIFTER:
            return <VedtakOgBeregningBoutgifter />;
        default:
            return <span>Har ikke vedtak for {stønadstypeTilTekst[behandling.stønadstype]}</span>;
    }
};
