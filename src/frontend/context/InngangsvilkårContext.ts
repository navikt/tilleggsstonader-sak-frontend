import { useState } from 'react';

import constate from 'constate';

import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Aktivitet } from '../Sider/Behandling/Inngangsvilkår/typer/aktivitet';
import { Målgruppe } from '../Sider/Behandling/Inngangsvilkår/typer/målgruppe';
import { Stønadsperiode } from '../Sider/Behandling/Inngangsvilkår/typer/stønadsperiode';
import { Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';

interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    leggTilMålgruppe: (nyPeriode: Målgruppe) => void;
    oppdaterMålgruppe: (oppdatertPeriode: Målgruppe) => void;
    aktiviteter: Aktivitet[];
    leggTilAktivitet: (nyPeriode: Aktivitet) => void;
    oppdaterAktivitet: (oppdatertPeriode: Aktivitet) => void;
    hentVilkårperioder: RerrunnableEffect;
    // vilkårFeilmeldinger: Vurderingsfeilmelding;
    stønadsperioder: Stønadsperiode[];
    hentStønadsperioder: RerrunnableEffect;
}

interface Props {
    vilkårperioder: Vilkårperioder;
    hentVilkårperioder: RerrunnableEffect;
    stønadsperioder: Stønadsperiode[];
    hentStønadsperioder: RerrunnableEffect;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate(
    ({
        vilkårperioder,
        hentVilkårperioder,
        stønadsperioder,
        hentStønadsperioder,
    }: Props): UseInngangsvilkår => {
        const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(vilkårperioder.målgrupper);
        const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(vilkårperioder.aktiviteter);

        // const [vilkårFeilmeldinger, settVilkårfeilmeldinger] = useState<Vurderingsfeilmelding>({});

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
            aktiviteter,
            leggTilAktivitet,
            oppdaterAktivitet,
            hentVilkårperioder,
            // vilkårFeilmeldinger,
            stønadsperioder,
            hentStønadsperioder,
        };
    }
);
