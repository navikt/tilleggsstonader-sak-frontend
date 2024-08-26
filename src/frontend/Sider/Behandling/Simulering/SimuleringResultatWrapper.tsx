import React, { useEffect, useState } from 'react';

import { Alert } from '@navikt/ds-react';

import SimuleringTabell from './SimuleringTabell';
import { SimuleringResponse } from './simuleringTyper';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

const SimuleringResultatWrapper: React.FC = () => {
    const { behandling } = useBehandling();
    const { request } = useApp();

    const [simuleringsresultat, settSimuleringsresultat] =
        useState<Ressurs<SimuleringResponse | null>>(byggTomRessurs());

    useEffect(() => {
        request<SimuleringResponse | null, null>(`/api/sak/simulering/${behandling.id}`).then(
            settSimuleringsresultat
        );
    }, [request, settSimuleringsresultat, behandling.id]);

    const erFørstegangsbehandling = behandling.type === BehandlingType.FØRSTEGANGSBEHANDLING;

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => (
                <>
                    {simuleringsresultat ? (
                        <SimuleringTabell perioder={simuleringsresultat.perioder} />
                    ) : (
                        <Alert variant={'info'} inline>
                            {erFørstegangsbehandling
                                ? 'Ingen simulering for førstegangsbehandling'
                                : 'Ingen simulering lagret for behandling'}
                        </Alert>
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default SimuleringResultatWrapper;
