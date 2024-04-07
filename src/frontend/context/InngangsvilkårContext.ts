import { useState } from 'react';

import constate from 'constate';

import { useEffectNotInitialRender } from '../hooks/felles/useEffectNotInitialRender';
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
    stønadsperiodeFeil: string | undefined;
    settStønadsperiodeFeil: (feilmelding: string | undefined) => void;
    oppdaterStønadsperioder: (oppdaterteStønadsperioder: Stønadsperiode[]) => void;
    hentStønadsperioder: RerrunnableEffect;
}

interface Props {
    vilkårperioder: Vilkårperioder;
    hentVilkårperioder: RerrunnableEffect;
    hentedeStønadsperioder: Stønadsperiode[];
    hentStønadsperioder: RerrunnableEffect;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate(
    ({
        vilkårperioder,
        hentVilkårperioder,
        hentedeStønadsperioder,
        hentStønadsperioder,
    }: Props): UseInngangsvilkår => {
        const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(vilkårperioder.målgrupper);
        const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(vilkårperioder.aktiviteter);
        const [stønadsperioder, settStønadsperioder] =
            useState<Stønadsperiode[]>(hentedeStønadsperioder);
        const [stønadsperiodeFeil, settStønadsperiodeFeil] = useState<string>();

        // const [vilkårFeilmeldinger, settVilkårfeilmeldinger] = useState<Vurderingsfeilmelding>({});

        useEffectNotInitialRender(() => {
            settStønadsperioder(hentedeStønadsperioder);
        }, [hentedeStønadsperioder]);

        useEffectNotInitialRender(() => {
            settMålgrupper(vilkårperioder.målgrupper);
            settAktiviteter(vilkårperioder.aktiviteter);
        }, [vilkårperioder]);

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
            stønadsperiodeFeil,
            settStønadsperiodeFeil,
            oppdaterStønadsperioder: (oppdaterteStønadsperioder: Stønadsperiode[]) =>
                settStønadsperioder(oppdaterteStønadsperioder),
            hentStønadsperioder,
        };
    }
);
