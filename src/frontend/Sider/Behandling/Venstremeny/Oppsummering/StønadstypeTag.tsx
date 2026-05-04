import React from 'react';

import { Tag } from '@navikt/ds-react';

import {
    Stønadstype,
    stønadstypeTilTekstUtenBehandlendeEnhet,
} from '../../../../typer/behandling/behandlingTema';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

export function StønadstypeTag({ stønadstype }: { stønadstype: Stønadstype }) {
    return (
        <Tag data-color="neutral" size="small" variant="outline">
            {tekstMedFallback(stønadstypeTilTekstUtenBehandlendeEnhet, stønadstype)}
        </Tag>
    );
}
