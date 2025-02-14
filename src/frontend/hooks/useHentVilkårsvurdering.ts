import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
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
