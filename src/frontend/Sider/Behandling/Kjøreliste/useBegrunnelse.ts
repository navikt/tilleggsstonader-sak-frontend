import { useEffect, useState } from 'react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../../typer/ressurs';

export interface BegrunnelseDto {
    begrunnelse: string | null;
}

export const useBegrunnelse = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [begrunnelseRessurs, settBegrunnelseRessurs] =
        useState<Ressurs<BegrunnelseDto>>(byggTomRessurs());

    useEffect(() => {
        settBegrunnelseRessurs(byggHenterRessurs());
        request<BegrunnelseDto, undefined>(
            `/api/sak/kjorelistebrev/${behandling.id}/begrunnelse`,
            'GET'
        ).then(settBegrunnelseRessurs);
    }, [behandling.id, request]);

    return { begrunnelseRessurs };
};
