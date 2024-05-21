import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { InfoSeksjon } from './Visningskomponenter';
import {
    FaktaHovedytelse,
    hovedytelseTilTekst,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';
import { tekstEllerKode } from '../../../../utils/tekstformatering';

const Hovedytelse: React.FC<{ faktaHovedytelse: FaktaHovedytelse }> = ({ faktaHovedytelse }) => {
    return (
        <InfoSeksjon label="Ytelse/situasjon" ikon={<CardIcon />}>
            <BodyShort size="small">
                {faktaHovedytelse.søknadsgrunnlag?.hovedytelse
                    ?.map((hovedytelse) => tekstEllerKode(hovedytelseTilTekst, hovedytelse))
                    ?.join(', ')}
            </BodyShort>
        </InfoSeksjon>
    );
};

export default Hovedytelse;
