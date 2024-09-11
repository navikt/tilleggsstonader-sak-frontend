import React from 'react';

import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

export function RevurderingTag({
    forrigeBehandlingId,
}: {
    forrigeBehandlingId: string | null | undefined;
}) {
    if (!forrigeBehandlingId) {
        return null;
    }
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
