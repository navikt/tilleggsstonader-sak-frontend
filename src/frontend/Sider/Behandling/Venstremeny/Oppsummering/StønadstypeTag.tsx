import React from 'react';

import { Tag } from '@navikt/ds-react';

import { Behandling } from '../../../../typer/behandling/behandling';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';

export function StonadstypeTag({ behandling }: { behandling: Behandling }) {
    return (
        <div>
            <Tag size="small" variant="neutral">
                {formaterEnumVerdi(behandling.stønadstype)}
            </Tag>
        </div>
    );
}
