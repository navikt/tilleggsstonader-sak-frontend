import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { VilkårperioderResponse } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    vilkårperioderResponse: Ressurs<VilkårperioderResponse>;
    hentVilkårperioder: () => void;
}

export const useVilkårperioder = (behandlingId: string): Response => {
    const { request } = useApp();
    const [vilkårperioder, settVilkårperioder] =
        useState<Ressurs<VilkårperioderResponse>>(byggTomRessurs());

    const hentVilkårperioder = useCallback(() => {
        settVilkårperioder(byggHenterRessurs());
        request<VilkårperioderResponse, null>(
            `/api/sak/vilkarperiode/behandling/${behandlingId}`
        ).then(settVilkårperioder);
    }, [request, settVilkårperioder, behandlingId]);

    useEffect(() => {
        hentVilkårperioder();
    }, [hentVilkårperioder]);

    return {
        vilkårperioderResponse: vilkårperioder,
        hentVilkårperioder,
    };
};
