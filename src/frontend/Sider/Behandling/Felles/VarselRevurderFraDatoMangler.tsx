import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { BehandlingType } from '../../../typer/behandling/behandlingType';

export const VarselRevurderFraDatoMangler = () => {
    const { behandling, behandlingErRedigerbar } = useBehandling();

    const erRevurdering = behandling.type === BehandlingType.REVURDERING;
    const revurderFraDatoErSatt = !!behandling.revurderFra;

    if (!erRevurdering || revurderFraDatoErSatt) {
        return null;
    }

    if (erRevurdering && !revurderFraDatoErSatt && !behandlingErRedigerbar) {
        return (
            <Alert variant={'warning'} size={'small'}>
                I denne revurderingen er det testet ny funksjonalitet uten revurder-fra dato.
                Systemet har her selv utledet datoen for endringen som brukes til beregningen.
            </Alert>
        );
    } else {
        return (
            <Alert variant={'warning'} size={'small'}>
                Du må sette revurder fra-dato før du kan gjøre endringer.
            </Alert>
        );
    }
};
