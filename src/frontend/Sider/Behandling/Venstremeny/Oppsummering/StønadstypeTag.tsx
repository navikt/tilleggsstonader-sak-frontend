import React from 'react';

import { Tag } from '@navikt/ds-react';

import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';

export function StønadstypeTag({ stønadstype }: { stønadstype: Stønadstype }) {
    return (
        <Tag size="small" variant="neutral">
            {formaterEnumVerdi(stønadstype)}
        </Tag>
    );
}
