import React from 'react';

import { Tag } from '@navikt/ds-react';

import { Behandling } from '../../../../typer/behandling/behandling';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';

export function StønadstypeTag({ behandling }: { behandling: Behandling }) {
    return (
        <Tag size="small" variant="neutral">
            {formaterEnumVerdi(behandling.stønadstype)}
        </Tag>
    );
}
