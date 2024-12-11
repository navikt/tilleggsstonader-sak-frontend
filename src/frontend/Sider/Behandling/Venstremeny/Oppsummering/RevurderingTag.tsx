import React from 'react';

import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

import { Behandling } from '../../../../typer/behandling/behandling';
import { BehandlingType } from '../../../../typer/behandling/behandlingType';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';

export function RevurderingTag({ behandling }: { behandling: Behandling }) {
    if (behandling.type != BehandlingType.REVURDERING) {
        return null;
    }

    return (
        <div style={{ display: 'flex', gap: '4px' }}>
            <Tag size="small" variant="neutral">
                {formaterEnumVerdi(behandling.stønadstype)}
            </Tag>
            <Tag size="small" variant="warning" icon={<ArrowsSquarepathIcon />}>
                Revurdering - {formaterEnumVerdi(behandling.behandlingsårsak)}
            </Tag>
        </div>
    );
}
