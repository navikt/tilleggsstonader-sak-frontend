import React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

import { formaterIsoDato } from '../../../../utils/dato';

export const ReadMoreTidligsteEndring = ({ tidligsteEndring }: { tidligsteEndring: string }) => (
    <ReadMore header={'Hvorfor vises ikke flere endringer?'} size={'small'} defaultOpen={true}>
        <BodyLong size={'small'}>
            Beregningen er gjort fra og med <b>{formaterIsoDato(tidligsteEndring)}</b>. Denne datoen
            er valgt fordi det er det tidligste tidspunktet en endring i nåværende behandling har
            virkning fra, og som dermed kan påvirke beregningsresultatet.
            <br />
            Perioder før denne datoen er ikke inkludert i beregningen, da de ikke påvirkes av de
            endringene som er gjort.
        </BodyLong>
    </ReadMore>
);
