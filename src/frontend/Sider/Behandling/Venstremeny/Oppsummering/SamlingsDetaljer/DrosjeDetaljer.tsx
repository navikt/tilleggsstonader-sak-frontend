import React from 'react';

import { FaktaDrosjeInfo } from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { SøknadInfoFelt } from '../Visningskomponenter';

export const DrosjeDetaljer: React.FC<{ drosje: FaktaDrosjeInfo }> = ({ drosje }) => (
    <>
        {drosje.harTTKort && (
            <SøknadInfoFelt
                label="Har du TT-kort?"
                value={tekstMedFallback(jaNeiTilTekst, drosje.harTTKort)}
            />
        )}
    </>
);
