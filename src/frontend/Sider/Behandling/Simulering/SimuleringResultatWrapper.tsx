import React, { useEffect, useState } from 'react';

import Oppsumering from './Oppsumering';
import SimuleringTabell from './SimuleringTabell';
import { SimuleringResponse } from './simuleringTyper';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
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

    return (
        <DataViewer response={{ simuleringsresultat }}>
            {({ simuleringsresultat }) => (
                <>
                    {simuleringsresultat ? (
                        <>
                            <Oppsumering oppsumering={simuleringsresultat.oppsummering} />
                            <SimuleringTabell perioder={simuleringsresultat.perioder} />
                        </>
                    ) : null}
                </>
            )}
        </DataViewer>
    );
};

export default SimuleringResultatWrapper;
