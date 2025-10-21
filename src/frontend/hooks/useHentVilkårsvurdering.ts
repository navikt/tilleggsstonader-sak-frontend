import { useCallback, useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { useBehandling } from '../context/BehandlingContext';
import { VilkårDagligReise } from '../Sider/Behandling/Stønadsvilkår/DagligReise/typer/vilkårDagligReise';
import { Vilkårsvurdering } from '../Sider/Behandling/vilkår';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

export const useHentVilkårsvurdering = (): {
    hentVilkårsvurdering: (behandlingsId: string) => void;
    vilkårsvurdering: Ressurs<Vilkårsvurdering>;
} => {
    const { request } = useApp();

    const [vilkårsvurdering, settVilkårsvurdering] =
        useState<Ressurs<Vilkårsvurdering>>(byggTomRessurs());

    const hentVilkårsvurdering = useCallback(
        (behandlingId: string) => {
            return request<Vilkårsvurdering, null>(`/api/sak/vilkar/${behandlingId}`).then(
                settVilkårsvurdering
            );
        },
        [request]
    );

    return {
        hentVilkårsvurdering,
        vilkårsvurdering,
    };
};

export const useHentVilkårDagligReise = (): {
    eksisterendeVilkår: Ressurs<VilkårDagligReise[]>;
} => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [eksisterendeVilkår, settEksisterendeVilkår] =
        useState<Ressurs<VilkårDagligReise[]>>(byggTomRessurs());

    const hentEksisterendeVilkår = useCallback(() => {
        request<VilkårDagligReise[], null>(
            `/api/sak/vilkar/daglig-reise/${behandling.id}`,
            'GET'
        ).then(settEksisterendeVilkår);
    }, [request, behandling.id]);

    useEffect(() => {
        hentEksisterendeVilkår();
    }, [hentEksisterendeVilkår]);

    return {
        eksisterendeVilkår,
    };
};
