import React from 'react';

import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

import { BehandlingType } from '../../../../typer/behandling/behandlingType';

export function RevurderingTag({ type }: { type: BehandlingType }) {
    if (type == BehandlingType.REVURDERING) {
        return (
            <Tag
                size="small"
                variant="warning"
                icon={<ArrowsSquarepathIcon />}
                style={{ maxWidth: 'fit-content' }}
            >
                Revurdering
            </Tag>
        );
    }
    return null;
}
