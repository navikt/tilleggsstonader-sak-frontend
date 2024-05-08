import { useCallback, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    hentVilkårperioder: (behandlingId: string) => void;
    vilkårperioder: Ressurs<Vilkårperioder>;
}

export const useVilkårperioder = (): Response => {
    const { request } = useApp();
    const [vilkårperioder, settVilkårperioder] =
        useState<Ressurs<Vilkårperioder>>(byggTomRessurs());

    const hentVilkårperioder = useCallback(
        (behandlingId: string) => {
            request<Vilkårperioder, null>(`/api/sak/vilkarperiode/behandling/${behandlingId}`).then(
                settVilkårperioder
            );
        },
        [request]
    );

    return {
        hentVilkårperioder,
        vilkårperioder,
    };
};
