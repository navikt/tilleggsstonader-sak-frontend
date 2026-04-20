import React from 'react';

import { CardIcon } from '@navikt/aksel-icons';

import { ArbeidOgOppholdFelt } from './ArbeidOgOpphold';
import { HovedytelseFelt } from './Hovedytelse';
import { InfoSeksjon } from './Visningskomponenter';
import {
    FaktaArbeidOgOpphold,
    FaktaHovedytelse,
} from '../../../../typer/behandling/behandlingFakta/faktaHovedytelse';

export const YtelseSituasjon: React.FC<{
    faktaHovedytelse: FaktaHovedytelse;
    arbeidOgOpphold?: FaktaArbeidOgOpphold;
}> = ({ faktaHovedytelse, arbeidOgOpphold }) => {
    return (
        <InfoSeksjon label="Ytelse/situasjon" ikon={<CardIcon />}>
            <HovedytelseFelt faktaHovedytelse={faktaHovedytelse} />
            {arbeidOgOpphold && <ArbeidOgOppholdFelt fakta={arbeidOgOpphold} />}
        </InfoSeksjon>
    );
};
