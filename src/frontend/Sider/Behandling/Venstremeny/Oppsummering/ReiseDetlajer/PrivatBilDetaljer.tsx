import React from 'react';

import { UtgifterBil } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { OppsummeringFelt } from '../Visningskomponenter';

export const PrivatBilDetaljer: React.FC<{ utgifterBil: UtgifterBil }> = ({ utgifterBil }) => (
    <>
        {utgifterBil.mottarGrunnstønad && (
            <OppsummeringFelt
                label="Mottar du grunnstønad fra NAV?"
                value={jaNeiTilTekst[utgifterBil.mottarGrunnstønad]}
            />
        )}

        {utgifterBil.parkering && (
            <OppsummeringFelt
                label="Må du betale for parkering med egen bil?"
                value={jaNeiTilTekst[utgifterBil.parkering]}
            />
        )}

        {utgifterBil.bompenger && (
            <OppsummeringFelt label="Bompenger per dag" value={`${utgifterBil.bompenger} kr`} />
        )}

        {utgifterBil.ferge && (
            <OppsummeringFelt label="Ferge per dag" value={`${utgifterBil.ferge} kr`} />
        )}

        {utgifterBil.piggdekkavgift && (
            <OppsummeringFelt
                label="Piggdekkavgift per dag"
                value={`${utgifterBil.piggdekkavgift} kr`}
            />
        )}
    </>
);
