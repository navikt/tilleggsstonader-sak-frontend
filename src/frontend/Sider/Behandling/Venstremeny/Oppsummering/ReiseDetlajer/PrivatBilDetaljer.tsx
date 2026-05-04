import React from 'react';

import { UtgifterBil } from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { SøknadInfoFelt } from '../Visningskomponenter';

export const PrivatBilDetaljer: React.FC<{ utgifterBil: UtgifterBil }> = ({ utgifterBil }) => (
    <>
        {utgifterBil.mottarGrunnstønad && (
            <SøknadInfoFelt
                label="Mottar du grunnstønad fra Nav?"
                value={jaNeiTilTekst[utgifterBil.mottarGrunnstønad]}
            />
        )}

        {utgifterBil.parkering && (
            <SøknadInfoFelt
                label="Må du betale for parkering med egen bil?"
                value={jaNeiTilTekst[utgifterBil.parkering]}
            />
        )}

        {utgifterBil.bompenger && (
            <SøknadInfoFelt label="Bompenger per dag" value={`${utgifterBil.bompenger} kr`} />
        )}

        {utgifterBil.ferge && (
            <SøknadInfoFelt label="Ferge per dag" value={`${utgifterBil.ferge} kr`} />
        )}

        {utgifterBil.piggdekkavgift && (
            <SøknadInfoFelt
                label="Piggdekkavgift per dag"
                value={`${utgifterBil.piggdekkavgift} kr`}
            />
        )}
    </>
);
