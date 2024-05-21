import { useEffect, useState } from 'react';

import { useApp } from '../context/AppContext';
import { Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';

interface Response {
    vilkårperioder: Ressurs<Vilkårperioder>;
}

export const useVilkårperioder = (behandlingId: string): Response => {
    const { request } = useApp();
    const [vilkårperioder, settVilkårperioder] =
        useState<Ressurs<Vilkårperioder>>(byggTomRessurs());

    useEffect(() => {
        request<Vilkårperioder, null>(`/api/sak/vilkarperiode/behandling/${behandlingId}`).then(
            settVilkårperioder
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandlingId]);

    return {
        vilkårperioder,
    };
};
