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
    const visHovedytelse = faktaHovedytelse.søknadsgrunnlag != null;
    const visArbeidOgOpphold = arbeidOgOpphold != null;

    if (!visHovedytelse && !visArbeidOgOpphold) {
        return null;
    }

    return (
        <InfoSeksjon label="Ytelse/situasjon" ikon={<CardIcon />}>
            {visHovedytelse && <HovedytelseFelt faktaHovedytelse={faktaHovedytelse} />}
            {visArbeidOgOpphold && arbeidOgOpphold && (
                <ArbeidOgOppholdFelt fakta={arbeidOgOpphold} />
            )}
        </InfoSeksjon>
    );
};
