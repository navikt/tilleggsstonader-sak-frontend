import { useState } from 'react';

import constate from 'constate';

import {
    Aktivitet,
    AktivitetType,
} from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    Målgruppe,
    MålgruppeType,
} from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    leggTilMålgruppe: (nyPeriode: Målgruppe) => void;
    oppdaterMålgruppe: (oppdatertPeriode: Målgruppe) => void;
    aktiviteter: Aktivitet[];
    leggTilAktivitet: (nyPeriode: Aktivitet) => void;
    oppdaterAktivitet: (oppdatertPeriode: Aktivitet) => void;
    slettVilkårperiode: (type: MålgruppeType | AktivitetType, id: string) => void;
}

interface Props {
    vilkårperioder: Vilkårperioder;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate(
    ({ vilkårperioder }: Props): UseInngangsvilkår => {
        const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(vilkårperioder.målgrupper);
        const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(vilkårperioder.aktiviteter);

        const leggTilMålgruppe = (nyPeriode: Målgruppe) => {
            settMålgrupper((prevState) => [...prevState, nyPeriode]);
        };

        const oppdaterMålgruppe = (oppdatertPeriode: Målgruppe) => {
            settMålgrupper((prevState) =>
                prevState.map((målgruppe) =>
                    målgruppe.id === oppdatertPeriode.id ? oppdatertPeriode : målgruppe
                )
            );
        };

        const slettVilkårperiode = (type: MålgruppeType | AktivitetType, id: string) => {
            if (type in MålgruppeType) {
                settMålgrupper((prevState) => prevState.filter((målgruppe) => målgruppe.id !== id));
            } else {
                settAktiviteter((prevState) =>
                    prevState.filter((aktivitet) => aktivitet.id !== id)
                );
            }
        };

        const leggTilAktivitet = (nyPeriode: Aktivitet) => {
            settAktiviteter((prevState) => [...prevState, nyPeriode]);
        };

        const oppdaterAktivitet = (oppdatertPeriode: Aktivitet) => {
            settAktiviteter((prevState) =>
                prevState.map((aktivitet) =>
                    aktivitet.id === oppdatertPeriode.id ? oppdatertPeriode : aktivitet
                )
            );
        };

        return {
            målgrupper,
            leggTilMålgruppe,
            oppdaterMålgruppe,
            slettVilkårperiode,
            aktiviteter,
            leggTilAktivitet,
            oppdaterAktivitet,
        };
    }
);
