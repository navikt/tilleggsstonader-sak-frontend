import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandling } from './BehandlingContext';
import { NyAktivitet } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/LeggTilAktivitet';
import { NyMålgruppe } from '../Sider/Behandling/Inngangsvilkår/Målgruppe/LeggTilMålgruppe';
import { Aktivitet, Målgruppe, Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer';
import { Ressurs, RessursStatus, RessursSuksess, byggTomRessurs } from '../typer/ressurs';

export interface UseInngangsvilkår {
    vilkårperioder: Ressurs<Vilkårperioder>;
    leggTilMålgruppe: (nyPeriode: NyMålgruppe) => Promise<void>;
    leggTilAktivitet: (nyPeriode: NyAktivitet) => Promise<void>;
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

    const leggTilMålgruppe = (nyPeriode: NyMålgruppe) => {
        return request<Målgruppe, NyMålgruppe>(
            `/api/sak/vilkar/${behandling.id}/periode`,
            'POST',
            nyPeriode
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVilkårperioder((prevState) =>
                    oppdaterVilkårsperioderMedNyMålgruppe(
                        prevState as RessursSuksess<Vilkårperioder>,
                        res.data
                    )
                );
            }
        });
    };

    const leggTilAktivitet = (nyPeriode: NyAktivitet) => {
        return request<Aktivitet, NyAktivitet>(
            `/api/sak/vilkar/${behandling.id}/periode`,
            'POST',
            nyPeriode
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVilkårperioder((prevState) =>
                    oppdaterVilkårsperioderMedNyAktivitet(
                        prevState as RessursSuksess<Vilkårperioder>,
                        res.data
                    )
                );
            }
        });
    };

    useEffect(() => {
        hentVilkårperioder(behandling.id);
    }, [hentVilkårperioder, behandling.id]);

    return { vilkårperioder, leggTilMålgruppe, leggTilAktivitet };
});

const oppdaterVilkårsperioderMedNyMålgruppe = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    nyPeriode: Målgruppe
) => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            målgrupper: [...vilkårperioder.data.målgrupper, nyPeriode],
        },
    };
};

const oppdaterVilkårsperioderMedNyAktivitet = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    nyPeriode: Aktivitet
) => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            aktiviteter: [...vilkårperioder.data.aktiviteter, nyPeriode],
        },
    };
};

// const oppdaterVilkårsperioderMedMålgruppe = (
//     vilkårperioder: RessursSuksess<Vilkårperioder>,
//     nyPeriode: Målgruppe
// ): RessursSuksess<Vilkårperioder> => {
//     return {
//         ...vilkårperioder,
//         data: {
//             ...vilkårperioder.data,
//             målgrupper: vilkårperioder.data.målgrupper.map((prevState) =>
//                 prevState.vilkår.id === nyPeriode.vilkår.id ? nyPeriode : prevState
//             ),
//         },
//     };
// };

// const oppdaterVilkårsperioderMedAktivitet = (
//     vilkårperioder: RessursSuksess<Vilkårperioder>,
//     nyPeriode: Aktivitet
// ): RessursSuksess<Vilkårperioder> => {
//     return {
//         ...vilkårperioder,
//         data: {
//             ...vilkårperioder.data,
//             aktiviteter: vilkårperioder.data.aktiviteter.map((prevState) =>
//                 prevState.vilkår.id === nyPeriode.vilkår.id ? (nyPeriode as Aktivitet) : prevState
//             ),
//         },
//     };
// };
