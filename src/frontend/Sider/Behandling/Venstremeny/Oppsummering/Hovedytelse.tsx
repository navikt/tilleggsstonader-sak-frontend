import React from 'react';

import { SøknadInfoFelt } from './Visningskomponenter';
import {
    FaktaHovedytelse,
    hovedytelseTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

export const HovedytelseFelt: React.FC<{
    faktaHovedytelse: FaktaHovedytelse;
}> = ({ faktaHovedytelse }) => {
    const harNedsattArbeidsevne = faktaHovedytelse.søknadsgrunnlag?.harNedsattArbeidsevne;
    const hovedytelse = faktaHovedytelse.søknadsgrunnlag?.hovedytelse
        ?.map((ytelse) => tekstMedFallback(hovedytelseTilTekst, ytelse))
        ?.join(', ');

    return (
        <>
            {hovedytelse && <SøknadInfoFelt label="Ytelse" value={hovedytelse} />}
            {harNedsattArbeidsevne && (
                <SøknadInfoFelt
                    label="Har nedsatt arbeidsevne"
                    value={tekstMedFallback(jaNeiTilTekst, harNedsattArbeidsevne)}
                />
            )}
        </>
    );
};
