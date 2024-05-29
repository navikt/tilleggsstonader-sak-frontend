import React, { SetStateAction, useEffect, useState } from 'react';

import constate from 'constate';

import { Aktivitet } from '../Sider/Behandling/Inngangsvilkår/typer/aktivitet';
import { Målgruppe } from '../Sider/Behandling/Inngangsvilkår/typer/målgruppe';
import { Stønadsperiode } from '../Sider/Behandling/Inngangsvilkår/typer/stønadsperiode';
import { Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';
import { Registeraktivitet } from '../typer/registeraktivitet';

interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    leggTilMålgruppe: (nyPeriode: Målgruppe) => void;
    oppdaterMålgruppe: (oppdatertPeriode: Målgruppe) => void;
    aktiviteter: Aktivitet[];
    leggTilAktivitet: (nyPeriode: Aktivitet) => void;
    oppdaterAktivitet: (oppdatertPeriode: Aktivitet) => void;
    stønadsperioder: Stønadsperiode[];
    stønadsperiodeFeil: string | undefined;
    settStønadsperiodeFeil: (feilmelding: string | undefined) => void;
    oppdaterStønadsperioder: (oppdaterteStønadsperioder: Stønadsperiode[]) => void;
    leggTilAktivitetFraRegister: (aktivitet: Registeraktivitet) => void;
    leggerTilNyAktivitet: boolean;
    settLeggerTilNyAktivitet: React.Dispatch<SetStateAction<boolean>>;
    aktivitetFraRegister?: Registeraktivitet;
    settAktivitetFraRegister: React.Dispatch<SetStateAction<Registeraktivitet | undefined>>;
}

interface Props {
    vilkårperioder: Vilkårperioder;
    hentedeStønadsperioder: Stønadsperiode[];
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate(
    ({ vilkårperioder, hentedeStønadsperioder }: Props): UseInngangsvilkår => {
        const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(vilkårperioder.målgrupper);
        const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(vilkårperioder.aktiviteter);
        const [leggerTilNyAktivitet, settLeggerTilNyAktivitet] = useState<boolean>(false);
        const [stønadsperioder, settStønadsperioder] =
            useState<Stønadsperiode[]>(hentedeStønadsperioder);
        const [stønadsperiodeFeil, settStønadsperiodeFeil] = useState<string>();

        useEffect(() => {
            settStønadsperioder(hentedeStønadsperioder);
        }, [hentedeStønadsperioder]);

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

        const leggTilAktivitetFraRegister = (aktivitet: Registeraktivitet) => {
            if (leggerTilNyAktivitet) return;

            settAktivitetFraRegister(aktivitet);
            settLeggerTilNyAktivitet(true);
        };

        const [aktivitetFraRegister, settAktivitetFraRegister] = useState<Registeraktivitet>();

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
            stønadsperioder,
            stønadsperiodeFeil,
            settStønadsperiodeFeil,
            leggTilAktivitetFraRegister,
            oppdaterStønadsperioder: (oppdaterteStønadsperioder: Stønadsperiode[]) =>
                settStønadsperioder(oppdaterteStønadsperioder),
            leggerTilNyAktivitet,
            settLeggerTilNyAktivitet,
            aktivitetFraRegister,
            settAktivitetFraRegister,
        };
    }
);
