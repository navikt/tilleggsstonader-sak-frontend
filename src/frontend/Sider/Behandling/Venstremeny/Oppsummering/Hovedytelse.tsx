import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';

import { InfoSeksjon, InfoSeksjonLayout, OppsummeringFelt } from './Visningskomponenter';
import {
    FaktaHovedytelse,
    hovedytelseTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const Hovedytelse: React.FC<{
    faktaHovedytelse: FaktaHovedytelse;
    layout?: InfoSeksjonLayout;
}> = ({ faktaHovedytelse, layout = 'standalone' }) => {
    const harNedsattArbeidsevne = faktaHovedytelse.søknadsgrunnlag?.harNedsattArbeidsevne;
    const hovedytelse =
        faktaHovedytelse.søknadsgrunnlag?.hovedytelse
            ?.map((ytelse) => tekstEllerKode(hovedytelseTilTekst, ytelse))
            ?.join(', ') || '-';

    return (
        <InfoSeksjon label="Ytelse/situasjon" ikon={<CardIcon />} layout={layout}>
            <OppsummeringFelt label="Ytelse" value={hovedytelse} />
            {harNedsattArbeidsevne && (
                <OppsummeringFelt
                    label="Har nedsatt arbeidsevne"
                    value={jaNeiTilTekst[harNedsattArbeidsevne]}
                />
            )}
        </InfoSeksjon>
    );
};

export default Hovedytelse;
