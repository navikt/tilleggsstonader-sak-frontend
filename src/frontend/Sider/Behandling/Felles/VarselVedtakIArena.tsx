import React from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { formaterTilTekstligDato } from '../../../utils/dato';

export const VarselVedtakIArena = () => {
    const { behandling, behandlingFakta } = useBehandling();

    const vedtakTom = behandlingFakta.arena?.vedtakTom;
    if (!vedtakTom) {
        return null;
    }

    return (
        <Alert variant={'warning'} size={'small'}>
            <Heading size={'xsmall'} level="3">
                Søker har vedtak i Arena for{' '}
                {stønadstypeTilTekst[behandling.stønadstype].toLowerCase()} innvilget til og med{' '}
                {formaterTilTekstligDato(vedtakTom)}
            </Heading>
            Skal du innvilge tilbake i tid? Gå til Arena for å sjekke at det ikke blir overlappende
            utbetalinger.
        </Alert>
    );
};
