import React from 'react';

import OppsummeringLæremidler from './OppsummeringLæremidler';
import OppsummeringTilsynBarn from './OppsummeringTilsynBarn';
import { RevurderingTag } from './RevurderingTag';
import { useBehandling } from '../../../../context/BehandlingContext';
import {
    BehandlingFaktaLæremidler,
    BehandlingFaktaTilsynBarn,
} from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

const OppsummeringSøknad: React.FC = () => {
    const { behandlingFakta, behandling } = useBehandling();
    return (
        <>
            <RevurderingTag behandling={behandling} />
            {behandlingFakta['@type'] === Stønadstype.BARNETILSYN && (
                <OppsummeringTilsynBarn
                    behandlingFakta={behandlingFakta as BehandlingFaktaTilsynBarn}
                />
            )}
            {behandlingFakta['@type'] === Stønadstype.LÆREMIDLER && (
                <OppsummeringLæremidler
                    behandlingFakta={behandlingFakta as BehandlingFaktaLæremidler}
                />
            )}
        </>
    );
};

export default OppsummeringSøknad;
