import React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';

export const VedtaksperiodeReadMore = ({ stønadstype }: { stønadstype: Stønadstype }) => {
    switch (stønadstype) {
        case Stønadstype.LÆREMIDLER:
            return readMoreLæremidler;
        case Stønadstype.BARNETILSYN:
        case Stønadstype.BOUTGIFTER:
            return null;
    }
};

const readMoreLæremidler = (
    <ReadMore header="Slik setter du vedtaksperioden" size="small">
        <BodyLong size={'small'}>
            Hvis søker har utdanning som feks går fra januar - desember og skal ha vedtaksperiode på
            10 måneder, må det settes to vedtaksperioder, en fra 1. januar - 30. juni og en fra 1.
            august - 31. desember som tilsammen blir 10 måneder. Hvis vedtaksperioden går over
            årsskiftet, f.eks. fra 1. august - 31. mai, trenger du ikke dele dette opp i to
            perioder.
        </BodyLong>
    </ReadMore>
);
