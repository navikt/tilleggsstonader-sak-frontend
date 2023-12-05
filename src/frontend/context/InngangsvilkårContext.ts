import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandling } from './BehandlingContext';
import {
    defaultAktivitetStateMock,
    defaultMålgruppeStateMock,
} from '../Sider/Behandling/Inngangsvilkår/mockUtils';
import { Aktivitet, Målgruppe, Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer';
import { RessursStatus } from '../typer/ressurs';

export interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    settMålgrupper: React.Dispatch<React.SetStateAction<Målgruppe[]>>;
    aktiviteter: Aktivitet[];
    settAktiviteter: React.Dispatch<React.SetStateAction<Aktivitet[]>>;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(defaultMålgruppeStateMock);

    const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(defaultAktivitetStateMock);

    const hentVilkårperioder = useCallback(
        (behandlingId: string) => {
            return request<Vilkårperioder, null>(`/api/sak/vilkar/${behandlingId}/periode`).then(
                (res) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        settMålgrupper(res.data.målgrupper);
                        settAktiviteter(res.data.aktiviteter);
                    }
                }
            );
        },
        [request]
    );

    useEffect(() => {
        hentVilkårperioder(behandling.id);
    }, [hentVilkårperioder, behandling.id]);

    return { målgrupper, settMålgrupper, aktiviteter, settAktiviteter };
});
