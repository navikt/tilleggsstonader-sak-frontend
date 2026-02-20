import React from 'react';

import { Tag } from '@navikt/ds-react';

import { Stønadstype, stønadstypeTilTekst } from '../../../../typer/behandling/behandlingTema';

export function StønadstypeTag({ stønadstype }: { stønadstype: Stønadstype }) {
    return (
        <Tag data-color="neutral" size="small" variant="outline">
            {stønadstypeTilTekst[stønadstype]}
        </Tag>
    );
}
