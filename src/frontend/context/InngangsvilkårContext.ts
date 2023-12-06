import { useCallback, useEffect, useState } from 'react';

import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandling } from './BehandlingContext';
import { Aktivitet, Målgruppe, Vilkårperioder } from '../Sider/Behandling/Inngangsvilkår/typer';
import { SvarPåVilkår, Vilkår, Vurderingsfeilmelding } from '../Sider/Behandling/vilkår';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';

export interface UseInngangsvilkår {
    vilkårperioder: Ressurs<Vilkårperioder>;
    leggTilMålgruppe: (nyPeriode: Målgruppe) => void;
    leggTilAktivitet: (nyPeriode: Aktivitet) => void;
    lagreVilkår: (vilkår: SvarPåVilkår) => Promise<RessursSuksess<Vilkår> | RessursFeilet>;
    oppdaterMålgruppeVilkårState: (svarPåVilkår: SvarPåVilkår) => void;
    oppdaterAktivitetVilkårState: (svarPåVilkår: SvarPåVilkår) => void;
    vilkårFeilmeldinger: Vurderingsfeilmelding;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [vilkårperioder, settVilkårperioder] = useState<Ressurs<Vilkårperioder>>(
        byggTomRessurs()
    );

    const [vilkårFeilmeldinger, settVilkårfeilmeldinger] = useState<Vurderingsfeilmelding>({});

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

    const leggTilMålgruppe = (nyPeriode: Målgruppe) => {
        settVilkårperioder((prevState) =>
            oppdaterVilkårsperioderMedNyMålgruppe(
                prevState as RessursSuksess<Vilkårperioder>,
                nyPeriode
            )
        );
    };

    const leggTilAktivitet = (nyPeriode: Aktivitet) => {
        settVilkårperioder((prevState) =>
            oppdaterVilkårsperioderMedNyAktivitet(
                prevState as RessursSuksess<Vilkårperioder>,
                nyPeriode
            )
        );
    };

    const lagreVilkår = (vilkår: SvarPåVilkår): Promise<RessursSuksess<Vilkår> | RessursFeilet> => {
        return request<Vilkår, SvarPåVilkår>(`/api/sak/vilkar123`, 'POST', vilkår);
    };

    const oppdaterMålgruppeVilkårState = (svarPåVilkår: SvarPåVilkår) => {
        lagreVilkår(svarPåVilkår).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVilkårperioder((prevState) =>
                    oppdaterMålgruppeVilkår(prevState as RessursSuksess<Vilkårperioder>, res.data)
                );
            } else {
                settVilkårfeilmeldinger((prevState) => ({
                    ...prevState,
                    [svarPåVilkår.id]: res.frontendFeilmelding,
                }));
            }
        });
    };

    const oppdaterAktivitetVilkårState = (svarPåVilkår: SvarPåVilkår) => {
        lagreVilkår(svarPåVilkår).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVilkårperioder((prevState) =>
                    oppdaterAktivitetVilkår(prevState as RessursSuksess<Vilkårperioder>, res.data)
                );
            } else {
                settVilkårfeilmeldinger((prevState) => ({
                    ...prevState,
                    [svarPåVilkår.id]: res.frontendFeilmelding,
                }));
            }
        });
    };

    return {
        vilkårperioder,
        leggTilMålgruppe,
        leggTilAktivitet,
        lagreVilkår,
        oppdaterMålgruppeVilkårState,
        oppdaterAktivitetVilkårState,
        vilkårFeilmeldinger,
    };
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

const oppdaterMålgruppeVilkår = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    vilkår: Vilkår
): RessursSuksess<Vilkårperioder> => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            målgrupper: vilkårperioder.data.målgrupper.map((prevState) =>
                prevState.vilkår.id === vilkår.id ? { ...prevState, vilkår: vilkår } : prevState
            ),
        },
    };
};

const oppdaterAktivitetVilkår = (
    vilkårperioder: RessursSuksess<Vilkårperioder>,
    vilkår: Vilkår
): RessursSuksess<Vilkårperioder> => {
    return {
        ...vilkårperioder,
        data: {
            ...vilkårperioder.data,
            aktiviteter: vilkårperioder.data.aktiviteter.map((prevState) =>
                prevState.vilkår.id === vilkår.id ? { ...prevState, vilkår: vilkår } : prevState
            ),
        },
    };
};
