import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { VilkårperioderResponse } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    vilkårperioderResponse: Ressurs<VilkårperioderResponse>;
}

export const useVilkårperioder = (behandlingId: string): Response => {
    const { request } = useApp();
    const [vilkårperioder, settVilkårperioder] =
        useState<Ressurs<VilkårperioderResponse>>(byggTomRessurs());

    useEffect(() => {
        request<VilkårperioderResponse, null>(
            `/api/sak/vilkarperiode/behandling/${behandlingId}/v2`
        ).then(settVilkårperioder);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandlingId]);

    return {
        vilkårperioderResponse: vilkårperioder,
    };
};
