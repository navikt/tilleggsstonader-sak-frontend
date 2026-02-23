import React from 'react';

import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';
import { MetaLime100 } from '@navikt/ds-tokens/js';

import { Behandling } from '../../../../typer/behandling/behandling';
import { BehandlingType } from '../../../../typer/behandling/behandlingType';
import { formaterEnumVerdi } from '../../../../utils/tekstformatering';

export function RevurderingTag({ behandling }: { behandling: Behandling }) {
    if (behandling.type != BehandlingType.REVURDERING) {
        return null;
    }

    return (
        <Tag
            data-color="info"
            size="small"
            variant="outline"
            icon={<ArrowsSquarepathIcon />}
            style={{ maxWidth: 'fit-content', backgroundColor: MetaLime100 }}
        >
            Revurdering - {formaterEnumVerdi(behandling.behandlingsårsak)}
        </Tag>
    );
}
