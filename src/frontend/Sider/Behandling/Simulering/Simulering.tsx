import React, { useEffect, useState } from 'react';

import { SimuleringResponse } from './simuleringTyper';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

const Simulering: React.FC = () => {
    const { behandling } = useBehandling();
    const { request } = useApp();

    const [simuleringsresultat, settSimuleringsresultat] =
        useState<Ressurs<SimuleringResponse>>(byggTomRessurs());

    useEffect(() => {
        request<SimuleringResponse, null>(`/api/sak/simulering/${behandling.id}`).then(
            settSimuleringsresultat
        );
    }, [request, settSimuleringsresultat, behandling.id]);

    return <div>Simulering</div>;
};

export default Simulering;
