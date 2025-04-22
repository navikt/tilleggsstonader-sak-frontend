import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    FaktaHovedytelse,
    hovedytelseTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { jaNeiTilTekst } from '../../../../typer/common';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const Hovedytelse: React.FC<{ faktaHovedytelse: FaktaHovedytelse }> = ({ faktaHovedytelse }) => {
    const harNedsattArbeidsevne = faktaHovedytelse.søknadsgrunnlag?.harNedsattArbeidsevne;
    return (
        <InfoSeksjon label="Ytelse/situasjon" ikon={<CardIcon />}>
            <BodyShort size="small">
                {faktaHovedytelse.søknadsgrunnlag?.hovedytelse
                    ?.map((hovedytelse) => tekstEllerKode(hovedytelseTilTekst, hovedytelse))
                    ?.join(', ')}
            </BodyShort>
            {harNedsattArbeidsevne && (
                <BodyShort size={'small'}>
                    Har nedsatt arbeidsevne: {jaNeiTilTekst[harNedsattArbeidsevne]}
                </BodyShort>
            )}
        </InfoSeksjon>
    );
};

export default Hovedytelse;
