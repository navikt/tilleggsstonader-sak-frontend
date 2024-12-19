import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { BehandlingType } from '../../../typer/behandling/behandlingType';

export const VarselRevurderFraDatoMangler = () => {
    const { behandling } = useBehandling();

    const erRevurdering = behandling.type === BehandlingType.REVURDERING;
    const revurderFraDatoErSatt = !!behandling.revurderFra;

    if (!erRevurdering || revurderFraDatoErSatt) {
        return null;
    }

    return (
        <Alert variant={'warning'} size={'small'}>
            Du må sette revurder fra-dato før du kan gjøre endringer.
        </Alert>
    );
};
