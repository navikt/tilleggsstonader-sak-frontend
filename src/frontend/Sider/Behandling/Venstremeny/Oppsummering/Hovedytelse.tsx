import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';

import { InfoSeksjon, OppsummeringFelt } from './Visningskomponenter';
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

export function harHovedytelseopplysninger(faktaHovedytelse: FaktaHovedytelse): boolean {
    return Boolean(
        faktaHovedytelse.søknadsgrunnlag?.hovedytelse?.length ||
        faktaHovedytelse.søknadsgrunnlag?.harNedsattArbeidsevne
    );
}

const Hovedytelse: React.FC<{
    faktaHovedytelse: FaktaHovedytelse;
}> = ({ faktaHovedytelse }) => {
    if (!harHovedytelseopplysninger(faktaHovedytelse)) {
        return null;
    }

    return (
        <InfoSeksjon label="Ytelse/situasjon" ikon={<CardIcon />}>
            <HovedytelseFelt faktaHovedytelse={faktaHovedytelse} />
        </InfoSeksjon>
    );
};

export default Hovedytelse;
