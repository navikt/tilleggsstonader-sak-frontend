import React from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { BarnOppsummering } from '../../../../../typer/vilkårsoppsummering';

const minsteAlder = (vilkårsvurderteBarn: BarnOppsummering[]) => {
    const alderArray = vilkårsvurderteBarn.map((barn) => barn.alderNårStønadsperiodeBegynner || 0);
    return Math.min(...alderArray);
};

export const VarselBarnUnder2År = (props: { vilkårsvurderteBarn: BarnOppsummering[] }) => {
    if (minsteAlder(props.vilkårsvurderteBarn) > 2) {
        return null;
    }

    return (
        <Alert variant={'warning'} size={'small'}>
            <Heading size={'xsmall'} level="3">
                Mulig kontantstøtte. Søker har barn under 2 år.
            </Heading>
            Sjekk om det utbetales kontantstøtte for barnet. Meld fra til teamet hvis det er
            tilfelle.
        </Alert>
    );
};
