import React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

export const LesMerStønadsperioder = () => {
    return (
        <ReadMore header={'Slik settes stønadsperiode'} size={'small'}>
            <BodyLong size={'small'} spacing>
                Stønadsperioden er perioden søker har arbeidsrettet aktivitet og samtidig er i
                riktig målgruppe. Stønadsperioden vil komme med i vedtaksbrev og skal begrense
                perioden bruker kan få utbetalt stønad. Som hovedregel kan den settes maks 3 måneder
                tilbake i tid (fra søknadsdato) og ut skole/barnehageår. Søker må søke på nytt ved
                nytt skole/barnehageår.
            </BodyLong>
            <BodyLong size={'small'}>
                Du kan legge inn flere stønadsperioder hvis bruker f.eks. er i flere målgrupper mens
                det gjennomføres en aktivitet.
            </BodyLong>
        </ReadMore>
    );
};
