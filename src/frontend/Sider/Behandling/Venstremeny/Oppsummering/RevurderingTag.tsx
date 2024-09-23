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
        <Tag
            size="small"
            variant="warning"
            icon={<ArrowsSquarepathIcon />}
            style={{ maxWidth: 'fit-content' }}
        >
            Revurdering - {formaterEnumVerdi(behandling.behandlingsårsak)}
        </Tag>
    );
}
