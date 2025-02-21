import { useEffect, useState } from 'react';

import constate from 'constate';

import { Feil, lagFeilmelding } from '../komponenter/Feil/feilmeldingUtils';
import { Stønadsperiode } from '../Sider/Behandling/Inngangsvilkår/typer/stønadsperiode';
import {
    Aktivitet,
    AktivitetType,
} from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    Målgruppe,
    MålgruppeType,
} from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import {
    StønadsperiodeStatus,
    Vilkårperioder,
} from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';

interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    leggTilMålgruppe: (nyPeriode: Målgruppe) => void;
    oppdaterMålgruppe: (oppdatertPeriode: Målgruppe) => void;
    aktiviteter: Aktivitet[];
    leggTilAktivitet: (nyPeriode: Aktivitet) => void;
    oppdaterAktivitet: (oppdatertPeriode: Aktivitet) => void;
    slettVilkårperiode: (type: MålgruppeType | AktivitetType, id: string) => void;
    stønadsperioder: Stønadsperiode[];
    stønadsperiodeFeil: Feil | undefined;
    settStønadsperiodeFeil: (feilmelding: Feil | undefined) => void;
    oppdaterStønadsperioder: (oppdaterteStønadsperioder: Stønadsperiode[]) => void;
    oppdatertStønadsperiodeFeil: (
        status: StønadsperiodeStatus,
        stønadsperiodeFeil?: string
    ) => void;
}

interface Props {
    vilkårperioder: Vilkårperioder;
    hentedeStønadsperioder: Stønadsperiode[];
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate(
    ({ vilkårperioder, hentedeStønadsperioder }: Props): UseInngangsvilkår => {
        const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(vilkårperioder.målgrupper);
        const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(vilkårperioder.aktiviteter);
        const [stønadsperioder, settStønadsperioder] =
            useState<Stønadsperiode[]>(hentedeStønadsperioder);
        const [stønadsperiodeFeil, settStønadsperiodeFeil] = useState<Feil>();

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

        const oppdatertStønadsperiodeFeil = (
            status: StønadsperiodeStatus,
            stønadsperiodeFeil?: string
        ) => {
            if (status === StønadsperiodeStatus.Ok) {
                settStønadsperiodeFeil(undefined);
            } else if (stønadsperiodeFeil) {
                settStønadsperiodeFeil(lagFeilmelding(stønadsperiodeFeil));
            }
        };

        return {
            målgrupper,
            leggTilMålgruppe,
            oppdaterMålgruppe,
            slettVilkårperiode,
            aktiviteter,
            leggTilAktivitet,
            oppdaterAktivitet,
            stønadsperioder,
            stønadsperiodeFeil,
            settStønadsperiodeFeil,
            oppdaterStønadsperioder: (oppdaterteStønadsperioder: Stønadsperiode[]) =>
                settStønadsperioder(oppdaterteStønadsperioder),
            oppdatertStønadsperiodeFeil,
        };
    }
);
