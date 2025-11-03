import React from 'react';

import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';
import { ALimegreen100 } from '@navikt/ds-tokens/dist/tokens';

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
            variant="alt3"
            icon={<ArrowsSquarepathIcon />}
            style={{ maxWidth: 'fit-content', backgroundColor: ALimegreen100 }}
        >
            Revurdering - {formaterEnumVerdi(behandling.behandlingsårsak)}
        </Tag>
    );
}
