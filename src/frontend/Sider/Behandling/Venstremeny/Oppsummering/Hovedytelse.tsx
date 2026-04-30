import React from 'react';

import { OppsummeringFelt } from './Visningskomponenter';
import {
    FaktaHovedytelse,
    hovedytelseTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

export const HovedytelseFelt: React.FC<{
    faktaHovedytelse: FaktaHovedytelse;
}> = ({ faktaHovedytelse }) => {
    const harNedsattArbeidsevne = faktaHovedytelse.søknadsgrunnlag?.harNedsattArbeidsevne;
    const hovedytelse = faktaHovedytelse.søknadsgrunnlag?.hovedytelse
        ?.map((ytelse) => tekstEllerKode(hovedytelseTilTekst, ytelse))
        ?.join(', ');

    return (
        <>
            {hovedytelse && <OppsummeringFelt label="Ytelse" value={hovedytelse} />}
            {harNedsattArbeidsevne && (
                <OppsummeringFelt
                    label="Har nedsatt arbeidsevne"
                    value={jaNeiTilTekst[harNedsattArbeidsevne]}
                />
            )}
        </>
    );
};
