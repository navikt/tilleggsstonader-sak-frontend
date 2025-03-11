import React from 'react';

import { Tag } from '@navikt/ds-react';

import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

const stønadstypeTagTittel: Record<Stønadstype, string> = {
    BARNETILSYN: 'Barnetilsyn',
    LÆREMIDLER: 'Læremidler',
    BOUTGIFTER: 'Bolig/overnatting',
};

export function StønadstypeTag({ stønadstype }: { stønadstype: Stønadstype }) {
    return (
        <Tag size="small" variant="neutral">
            {stønadstypeTagTittel[stønadstype]}
        </Tag>
    );
}
