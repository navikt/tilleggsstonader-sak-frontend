import React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

export const PassBarnLesMer = () => {
    return (
        <ReadMore header={'Slik legger du inn utgifter'} size={'small'}>
            <BodyLong size={'small'} spacing>
                Hvis et barn har har ulike utgifter fra en måned til en annen, kan du legge til
                flere perioder med utgift.
            </BodyLong>
            <BodyLong size={'small'} spacing>
                Pass på at du legger inn utgifter på alle perioder barnet har utgifter, innenfor
                stønadsperioden(e) som er satt.
            </BodyLong>
            <BodyLong size={'small'}>
                Månedlig utgift skal bare være utgifter til pass. Utgifter til mat eller bleier må
                eventuelt trekkes fra før du legger inn summen.
            </BodyLong>
        </ReadMore>
    );
};
