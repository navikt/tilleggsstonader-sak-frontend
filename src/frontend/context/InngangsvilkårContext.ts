import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandling } from './BehandlingContext';
import { Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer';
import { Ressurs, byggTomRessurs } from '../typer/ressurs';

export interface UseInngangsvilkår {
    vilkårperioder: Ressurs<Vilkårperioder>;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [vilkårperioder, settVilkårperioder] = useState<Ressurs<Vilkårperioder>>(
        byggTomRessurs()
    );

    const hentVilkårperioder = useCallback(
        (behandlingId: string) => {
            return request<Vilkårperioder, null>(`/api/sak/vilkar/${behandlingId}/periode`).then(
                settVilkårperioder
            );
        },
        [request]
    );

    useEffect(() => {
        hentVilkårperioder(behandling.id);
    }, [hentVilkårperioder, behandling.id]);

    return { vilkårperioder };
});
